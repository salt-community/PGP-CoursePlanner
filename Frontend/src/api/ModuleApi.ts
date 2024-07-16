import { getCookie } from "../helpers/cookieHelpers";
import { CourseModule } from "../sections/course/Types";
import { ModuleType } from "../sections/module/Types";

const BASE_URL = "http://localhost:5268/Modules";

export async function getAllModules() {
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data as ModuleType[];
}

export async function getAllCourseModules() {
  const response = await fetch("http://localhost:5268/CourseModules", {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data as CourseModule[];
}

export async function getModuleById(moduleId: number) {
  const response = await fetch(`${BASE_URL}/${moduleId}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data as ModuleType;
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
    throw new Error("Failed to create module");
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
    throw new Error("Failed to edit module");
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
    throw new Error("Failed to delete module");
  }
}
