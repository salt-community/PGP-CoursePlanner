import { postCourse } from "../../api/CourseApi";
import Page from "../../components/Page";
import Course from "../../components/course/Course";
import { CourseType } from "../../components/course/Types";

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