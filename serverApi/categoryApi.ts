"use server"
require('dotenv').config();


export async function getCategory(){
    const serverUrl = process.env.URL;
    const data = await fetch(`${serverUrl}/category`);
    const resultJson = await data.json();
    return resultJson;
}
