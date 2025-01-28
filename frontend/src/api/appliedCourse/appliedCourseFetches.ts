import { getCookie } from "@helpers/cookieHelpers";
import { fetchWithRefreshTokenInterceptor } from "@helpers/interceptorHelpers";
import { CourseType } from "@models/course/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/AppliedCourses`;

export async function getAppliedCourses() {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
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
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // Log the entire response object
  console.log("Response Object:", response);

  // Log the actual JSON content of the response
  const responseData = await response.json();
  console.log("Response Data:", responseData);

  return responseData;
}

export async function postAppliedCourse(appliedCourse: CourseType) {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
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

export async function updateAppliedCourse(appliedCourse: CourseType) {
  console.log(appliedCourse);
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${appliedCourse.id}`, {
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
  const response = await fetchWithRefreshTokenInterceptor(`${BASE_URL}/${id}`, {
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