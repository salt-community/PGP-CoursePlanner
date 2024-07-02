import { CourseType } from "../components/course/Types";

//call to env 
//2 variables 
//one for baseurl one for port
//add slash api 

const BASE_URL = "http://localhost:5268/Courses";

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