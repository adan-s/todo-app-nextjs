"use server";
require("dotenv").config();

const serverUrl = process.env.URL;
interface User {
  id: number;
  email: string;
  username: string;
  password: string;
}

export async function findUser(usernameOrEmail: string): Promise<string | null> {
  const users = await getUsers();

  const user = users.find((user:User) => user.email === usernameOrEmail || user.email === usernameOrEmail);

  if (user) {
    return user.id;
  } else {
    return null;
  }
}

export async function getUser(usernameOrEmail: string): Promise<string | null> {
  const users = await getUsers();

  const user = users.find((user:User) => user.email === usernameOrEmail || user.email === usernameOrEmail);

  if (user) {
    return user;
  } else {
    return null;
  }
}


export async function getUsers() {
  const data = await fetch(`${serverUrl}/users`);
  const resultJson = await data.json();
  
  return resultJson;
}

export async function addUser(
  username: string,
  email: string,
  password: string
): Promise<any> {
  const url = `${serverUrl}/users`;

  const requestBody = {
    username: username,
    email: email,
    password: password,
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

export async function updateUser(
  userId: string,
  updatedUserData: { username?: string; email?: string; password?: string }
): Promise<any> {
  const url = `${serverUrl}/users/${userId}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUserData),
  });

  if (!response.ok) {
    const errorMessage = `An error occurred: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}
