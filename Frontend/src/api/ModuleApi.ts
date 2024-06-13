import { ModuleType } from "../components/module/Types";

const BASE_URL = "http://localhost:5268/Modules";

export async function getAllModules() {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data as ModuleType[];
}

export async function getModuleById(moduleId: number) {
  const response = await fetch(`${BASE_URL}/${moduleId}`);
  const data = await response.json();
  return data as ModuleType;
}

export async function postModule(module: ModuleType) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
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
    },
    body: JSON.stringify(module),
  });
  if (!response.ok) {
    throw new Error("Failed to edit module");
  }

}
