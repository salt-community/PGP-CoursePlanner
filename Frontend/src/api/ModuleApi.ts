import { getCookie } from "../helpers/cookieHelpers";
import { CourseModule } from "../models/course/Types";
import { ModuleType } from "../models/module/Types";
import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = `${BACKEND_URL}/Modules`;

export async function getAllModules() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      // alert("Failed to get modules");
      return;
    }

    const data = await response.json();
    return data as ModuleType[];
  } catch (error) {
    console.error(error);
    // alert("Failed to get modules");
  }
}

export async function getAllCourseModules() {
  try {
    const response = await fetch("http://localhost:8080/CourseModules", {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      alert("Failed to get course modules");
      return;
    }

    const data = await response.json();
    return data as CourseModule[];
  } catch (error) {
    console.error(error);
    alert("Failed to get course modules");
  }
}

export async function getModuleById(moduleId: number) {
  try {
    const response = await fetch(`${BASE_URL}/${moduleId}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      alert("Failed to get module");
      return;
    }

    const data = await response.json();
    return data as ModuleType;
  } catch (error) {
    console.error(error);
    alert("Failed to get  courses");
  }
}

export async function postModule(module: ModuleType) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(module),
    });

    if (!response.ok || response == null) {
      alert("Failed to get create module");
      return;
    }
  } catch (error) {
    console.error(error);
    alert("Failed to get create module");
  }
}

export async function editModule(module: ModuleType) {
  try {
    const response = await fetch(`${BASE_URL}/${module.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(module),
    });

    if (!response.ok || response == null) {
      alert("Failed to edit module");
      return;
    }

    const data = await response.json();
    return data as ModuleType;
  } catch (error) {
    console.error(error);
    alert("Failed to edit module");
  }
}

export async function deleteModule(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });
    if (!response.ok || response == null) {
      alert("Failed to delete module");
      return;
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete module");
  }
}
