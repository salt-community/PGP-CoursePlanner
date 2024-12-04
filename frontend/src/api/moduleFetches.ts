import { getCookie } from "@helpers/cookieHelpers";
import { ModuleType } from "@models/module/Types";

const BASE_URL = `${process.env.VITE_BACKEND_URL}/Modules`;

export async function getModules() {
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getModuleById(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function postModule(module: ModuleType) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(module),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function editModule(module: ModuleType) {
  const response = await fetch(`${BASE_URL}/${module.id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(module),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function deleteModule(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}
