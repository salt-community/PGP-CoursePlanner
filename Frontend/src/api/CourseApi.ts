import { getCookie } from "../helpers/cookieHelpers";
import { CourseType } from "../models/course/Types";
import { BACKEND_URL } from "./BackendUrl";

const BASE_URL = `${BACKEND_URL}/Courses`;

export async function getAllCourses() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      // alert("Failed to get  courses");
      return;
    }

    const data = await response.json();
    return data as CourseType[];
  } catch (error) {
    console.error(error);
    // alert("Failed to get  courses");
  }
}

export async function getCourseById(courseId: number) {
  try {
    const response = await fetch(`${BASE_URL}/${courseId}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      alert("Failed to get course");
      return;
    }

    const data = await response.json();
    return data as CourseType;
  } catch (error) {
    console.error(error);
    alert("Failed to get course");
  }
}

export async function postCourse(course: CourseType) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(course),
    });

    if (!response.ok || response == null) {
      alert("Failed to create course");
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    alert("Failed to create course");
  }
}

export async function editCourse(course: CourseType) {
  try {
    const response = await fetch(`${BASE_URL}/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
      body: JSON.stringify(course),
    });

    if (!response.ok || response == null) {
      alert("Failed to edit course");
      return;
    }

    const data = await response.json();
    return data as CourseType;
  } catch (error) {
    console.error(error);
    alert("Failed to edit course");
  }
}

export async function deleteCourse(id: number) {
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
      alert("Failed to delete course");
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    alert("Failed to delete course");
  }
}
