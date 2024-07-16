import { getCookie } from "../helpers/cookieHelpers";
import { AppliedCourseType } from "../sections/course/Types";

const BASE_URL = "http://localhost:5268/AppliedCourses";

export async function postAppliedCourse(appliedCourse: AppliedCourseType) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(appliedCourse),
  });

  if (!response.ok) {
    alert("Failed to apply course");
    throw new Error("Failed to apply course");
  }
  return response;
}

export async function getAllAppliedCourses() {
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data as AppliedCourseType[];
}

export async function deleteAppliedCourse(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete applied course");
  }
}

export async function getAppliedCourseById(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (response.ok) {
    const data = await response.json();
    return data as AppliedCourseType;
  }
}

export async function editAppliedCourse(appliedCourse: AppliedCourseType) {

  const response = await fetch(`${BASE_URL}/${appliedCourse.id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(appliedCourse),
  });
  if (!response.ok) {
    throw new Error("Failed to edit applied course");
  }

}
