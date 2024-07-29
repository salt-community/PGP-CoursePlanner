import { getCookie } from "../helpers/cookieHelpers";
import { AppliedModuleType } from "../models/appliedCourse/Types";
import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = `${BACKEND_URL}/AppliedModules`;

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