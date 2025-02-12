import { getCookie } from "@helpers/cookieHelpers";
import { fetchWithRefreshTokenInterceptor } from "@helpers/interceptorHelpers";
import { ModuleType } from "@models/course/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/Modules`;

export async function getModules() {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getModuleById(id: number) {
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function postModule(module: ModuleType) {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(module),
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }
}

export async function updateModule(module: ModuleType) {
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${module.id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(module),
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }
}

export async function deleteModule(id: number) {
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }
}
