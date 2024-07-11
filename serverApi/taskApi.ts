"use server";
require("dotenv").config();

const serverUrl = process.env.URL;

interface Category {
  id: number;
  category_name: string;
  user_id: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  duedate: Date;
  status: string;
  category_id: number;
  user_id: number;
  category_name?: string; 
}

export async function getTasks() {
  const tasksData = await fetch(`${serverUrl}/tasks`);
  const tasks: Task[] = await tasksData.json();

  const categoriesData = await fetch(`${serverUrl}/category`);
  const categories: Category[] = await categoriesData.json();

  const tasksWithCategoryName = tasks.map((task) => {
    const category = categories.find((cat) => cat.id === task.category_id);
    return {
      ...task,
      category_name: category ? category.category_name : "Unknown",
    };
  });

  return tasksWithCategoryName;
}


export async function getUserTasks(user_id:number) {
  const tasksData = await fetch(`${serverUrl}/tasks/api/${user_id}`);

  const tasks: Task[] = await tasksData.json();

  const categoriesData = await fetch(`${serverUrl}/category`);
  const categories: Category[] = await categoriesData.json();

  const tasksWithCategoryName = tasks.map((task) => {
    const category = categories.find((cat) => cat.id === task.category_id);
    return {
      ...task,
      category_name: category ? category.category_name : "Unknown",
    };
  });

  return tasksWithCategoryName;
}


export async function addTask(
  title: string,
  description: string,
  duedate: Date,
  status: string,
  category_name: string,
  userId: number
) {
  const categoriesData = await fetch(`${serverUrl}/category`);
  const categories: Category[] = await categoriesData.json();

  const category = categories.find((cat) => cat.category_name === category_name);

  if (!category) {
    throw new Error(`Category '${category_name}' not found.`);
  }

  const url = `${serverUrl}/tasks`;

  const requestBody = {
    title: title,
    description: description,
    duedate: duedate,
    status: status,
    category_id: category.id,
    user_id: userId,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorMessage = `An error occurred: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateTask(
  taskId: string,
  category_name: string,
  updatedTaskData: {
    title: string;
    description: string;
    duedate: Date;
    status: string;
  },
  userId: number
): Promise<any> {
  const categoriesData = await fetch(`${serverUrl}/category`);
  const categories: Category[] = await categoriesData.json();

  const category = categories.find((cat) => cat.category_name === category_name);

  if (!category) {
    throw new Error(`Category '${category_name}' not found.`);
  }

  const url = `${serverUrl}/tasks/${taskId}`;

  const requestBody = {
    ...updatedTaskData,
    category_id: category.id,
    user_id: userId,
  };
  
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorMessage = `An error occurred: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}