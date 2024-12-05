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
    
    return (
        <Page>
            <Course course={emptyCourse} buttonText="Create" />
        </Page>
    )
}