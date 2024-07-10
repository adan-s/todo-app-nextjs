"use server";
require("dotenv").config();

const serverUrl = process.env.URL;

interface Category {
  id: number;
  category_name: string;
  user_id: number;
}

export async function getTasks() {
  const data = await fetch(`${serverUrl}/tasks`);
  const resultJson = await data.json();
  return resultJson;
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
  const resultJson: Category[] = await categoriesData.json();

  const category = resultJson.find((cat) => cat.category_name === category_name);

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

  console.log("requestBody",requestBody)
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
    title: string,
    description: string,
    duedate: Date,
    status: string,
  },
  userId: number
): Promise<any> {
  const categoriesData = await fetch(`${serverUrl}/category`);
  const resultJson: Category[] = await categoriesData.json();

  const category = resultJson.find((cat) => cat.category_name === category_name);

  if (!category) {
    throw new Error(`Category '${category_name}' not found.`);
  }

  const url = `${serverUrl}/tasks/${taskId}`;

  const requestBody = {
    ...updatedTaskData,
    category_id: category.id,
    user_id: userId, 
  };

  console.log(requestBody);
  console.log(url);

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
