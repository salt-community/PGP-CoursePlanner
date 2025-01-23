import Page from "@components/Page";
//import Course from "../sections/Course";
import { useIdFromPath } from "@helpers/helperHooks";
import LoadingMessage from "@components/LoadingMessage";
import { useQueryCourseById } from "@api/course/courseQueries";
import Course from "../sections/Course";
import ErrorModal from "@components/ErrorModal";

export default function EditCourse() {
    const { data: course, isLoading, isError } = useQueryCourseById(useIdFromPath());

    return (
        <Page>
            {isLoading && <LoadingMessage />}
            {course && <Course course={course} buttonText="Save changes" />}
            {isError && <ErrorModal error="Course" />}
        </Page>
    )
}