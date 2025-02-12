import Page from "@components/Page";
import Course from "../sections/Course";
import { CourseType, Track } from "../Types";

export default function CreateCourse() {

    const myTrack: Track = { id: 0, color: "",  name: "", visibility: true, creationDate: new Date() }

    const emptyCourse: CourseType =
    {
        id: 0,
        name: "",
        numberOfWeeks: 0,
        startDate: new Date(),
        moduleIds: [0],
        track: myTrack,
        modules: [],
        miscellaneousEvents: [],
        creationDate: new Date()
    }

    return (
        <Page>
            <Course course={emptyCourse} buttonText="Create" />
        </Page>
    )
}