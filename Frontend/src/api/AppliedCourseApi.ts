import { getCookie } from "../helpers/cookieHelpers";
import { AppliedCourseType } from "../sections/course/Types";

//call to env
//2 variables
//one for baseurl one for port
//add slash api

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
