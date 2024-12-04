import { getCookie } from "@helpers/cookieHelpers";
import { ModuleType } from "@models/module/Types";

const BASE_URL = `${process.env.VITE_BACKEND_URL}/AppliedModules`;

export async function postAppliedModule(appliedModule: ModuleType): Promise<ModuleType> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(appliedModule),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function updateAppliedModule(appliedModule: ModuleType) {
  const response = await fetch(`${BASE_URL}/${appliedModule.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(appliedModule),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}