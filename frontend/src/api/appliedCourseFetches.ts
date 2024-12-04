import { getCookie } from "@helpers/cookieHelpers";
import { CourseType } from "@models/course/Types";

const BASE_URL = `${process.env.VITE_BACKEND_URL}/AppliedCourses`;

export async function getAppliedCourses() {
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getAppliedCourseById(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function postAppliedCourse(appliedCourse: CourseType) {
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
    throw new Error(response.statusText);
  }
}

export async function editAppliedCourse(appliedCourse: CourseType) {
  const response = await fetch(`${BASE_URL}/${appliedCourse.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(appliedCourse),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function deleteAppliedCourse(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}