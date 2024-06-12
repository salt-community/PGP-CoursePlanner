import { Module } from "../components/module/Types";

const BASE_URL = "http://localhost:5268/Modules";

export async function getAllModules() {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data as Module[];
}

export async function postModule(module: Module) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(module),
  });

  const data = await response.json();
  return data;
}
