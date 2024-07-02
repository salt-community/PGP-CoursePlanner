import { postCourse } from "../../api/CourseApi";
import Page from "../../sections/Page";
import Course from "../../sections/course/Course";
import { CourseType } from "../../sections/course/Types";

export default function CreateCourse() {

    const emptyCourse: CourseType =
    {
        name: "",
        numberOfWeeks: 0,
        modules: [],
        moduleIds: [0]
    }

    return (
        <Page>
            <Course course={emptyCourse} submitFunction={postCourse} buttonText="Create" />
        </Page>
    )
}