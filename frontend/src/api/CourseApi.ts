import { getCookie } from "@helpers/cookieHelpers";
import { CourseType } from "@models/course/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/Courses`;

export async function getAllCourses() {
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

export async function getCourseById(courseId: number) {
  const response = await fetch(`${BASE_URL}/${courseId}`, {
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

export async function postCourse(course: CourseType) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function editCourse(course: CourseType) {
  const response = await fetch(`${BASE_URL}/${course.id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function deleteCourse(id: number) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
}
