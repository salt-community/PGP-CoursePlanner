import { Course } from "../components/course/Types";

const BASE_URL = "http://localhost:5268/Courses";

export async function postCourse(course: Course) {
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