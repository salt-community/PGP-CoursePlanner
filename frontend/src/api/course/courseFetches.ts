import { getCookie } from "@helpers/cookieHelpers";
import { fetchWithRefreshTokenInterceptor } from "@helpers/interceptorHelpers";
import { CourseType } from "@api/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/Courses`;

export async function getCourses() {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getCourseById(id: number) {
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getModulesByCourseId(courseId: number) {
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/ModulesByCourse/${courseId}`, {
      headers: {
          Authorization: `Bearer ${getCookie("id_token")}`,
          Accept: "application/json",
      },
  });

  if (!response.ok) {
      throw new Error(response.statusText);
  }

  return await response.json();
}

export async function postCourse(course: CourseType) {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }
}

export async function updateCourse(course: CourseType) {
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${course.id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }
}

export async function deleteCourse(id: number) {
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("id_token")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }
}
