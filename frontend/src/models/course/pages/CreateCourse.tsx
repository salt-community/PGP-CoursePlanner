import { postCourse } from "@api/CourseApi";
import Page from "@components/Page";
import Course from "../sections/Course";
import { CourseType } from "../Types";

export default function CreateCourse() {

    const emptyCourse: CourseType =
    {
        name: "",
        numberOfWeeks: 0,
        startDate: new Date(),
        moduleIds: [0]
    }
    // Use Tanstack Query
    return (
        <Page>
            <Course course={emptyCourse} submitFunction={postCourse} buttonText="Create" />
        </Page>
    )
}