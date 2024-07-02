import { CourseType } from "../sections/course/Types";

const BASE_URL = "http://localhost:5268/Courses";

export async function getAllCourses() {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data as CourseType[];
}

export async function getCourseById(courseId: number) {
  const response = await fetch(`${BASE_URL}/${courseId}`);
  const data = await response.json();
  return data as CourseType;
}

export async function postCourse(course: CourseType) {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(course),
    });
  
    if (!response.ok) {
      throw new Error("Failed to create course");
    }
  }

  export async function editCourse(course: CourseType) {

    const response = await fetch(`${BASE_URL}/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(course),
    });
    if (!response.ok) {
      throw new Error("Failed to edit course");
    }
  
  }
  
  export async function deleteCourse(id: number) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if(!response.ok) {
      throw new Error("Failed to delete course");
    }
  }
  