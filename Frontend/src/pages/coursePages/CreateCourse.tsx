import { postCourse } from "../../api/CourseApi";
import Page from "../../components/Page";
import Course from "../../components/course/Course";
import { CourseType } from "../../components/course/Types";

export default function CreateCourse() {

    const emptyCourse: CourseType =
    {
        name: "",
        numberOfWeeks: 1,
        modules: [{
            name: "",
            numberOfDays: 1,
            days: [{
                dayNumber: 1,
                description: "",
                events: []
            }]
        }]
    }

    return (
        <Page>
            <Course course={emptyCourse} submitFunction={postCourse} buttonText="Create" />
        </Page>
    )
}