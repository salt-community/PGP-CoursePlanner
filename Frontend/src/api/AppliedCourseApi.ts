import { getCookie } from "../helpers/cookieHelpers";
import { AppliedCourseType } from "../models/course/Types";
import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = `${BACKEND_URL}/AppliedCourses`;

export async function postAppliedCourse(appliedCourse: AppliedCourseType) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(appliedCourse),
    });

    if (!response.ok || response == null) {
      alert("Failed to apply course");
      return;
    }

    return response;
  } catch (error) {
    console.error(error);
    alert("Failed to apply course");
  }
}

export async function getAllAppliedCourses() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      // alert("Failed to get applied courses");
      return;
    }

    const data = await response.json();
    return data as AppliedCourseType[];
  } catch (error) {
    console.error(error);
    // alert("Failed to get applied courses");
  }
}

export async function deleteAppliedCourse(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok || response == null) {
      alert("Failed to delete applied courses");
      return;
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete applied courses");
  }
}

export async function getAppliedCourseById(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok || response == null) {
      alert("Failed to get applied course");
      return;
    }
    const data = await response.json();
    return data as AppliedCourseType;
  } catch (error) {
    console.error(error);
    alert("Failed to get applied course");
  }
}

export async function editAppliedCourse(appliedCourse: AppliedCourseType) {
  try {
    const response = await fetch(`${BASE_URL}/${appliedCourse.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(appliedCourse),
    });
    if (!response.ok || response == null) {
      alert("Failed to edit applied course");
      return;
    }
  } catch (error) {
    console.error(error);
    alert("Failed to edit applied courses");
  }
}
