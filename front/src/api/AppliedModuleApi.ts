import { getCookie } from "../helpers/cookieHelpers";
import { AppliedModuleType } from "../models/appliedCourse/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/AppliedModules`;

export async function postAppliedModule(module: AppliedModuleType) {
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
    alert("Failed to apply module");
    throw new Error("Failed to apply module");
  }
  var data = await response.json();
  return data as AppliedModuleType;
}

export async function updateAppliedModule(appliedModule: AppliedModuleType) {
  const response = await fetch(`${BASE_URL}/${appliedModule.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(appliedModule),
  });
  if (!response.ok) {
    throw new Error("Failed to edit applied module");
  }
  return true;
}