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
    },
    body: JSON.stringify(appliedCourse),
  });

  if (!response.ok) {
    throw new Error("Failed to create course");
  }
}

export async function getAllAppliedCourses() {
  const response = await fetch(BASE_URL);
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
