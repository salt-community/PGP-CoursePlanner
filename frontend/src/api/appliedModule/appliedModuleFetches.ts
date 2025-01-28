import { getCookie } from "@helpers/cookieHelpers";
import { fetchWithRefreshTokenInterceptor } from "@helpers/interceptorHelpers";
import { ModuleType } from "@models/module/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/AppliedModules`;

export async function postAppliedModule(appliedModule: ModuleType): Promise<ModuleType> {
  console.log("Post")
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
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
  console.log("Update")
  console.log("Updating module:", appliedModule);
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${appliedModule.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(appliedModule),
  });

  if (!response.ok) {
    console.error("Failed to update module:", response.status);
    throw new Error(response.statusText);
  }
}