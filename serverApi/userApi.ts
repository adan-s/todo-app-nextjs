"use server";
require("dotenv").config();

const serverUrl = process.env.URL;

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
