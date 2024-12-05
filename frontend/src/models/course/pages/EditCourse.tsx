import Page from "@components/Page";
import Course from "../sections/Course";
import { useIdFromPath } from "@helpers/helperHooks";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import { useQueryCourseById } from "@api/courseQueries";

export default function EditCourse() {
    const { data: course, isLoading, isError } = useQueryCourseById(useIdFromPath());

    return (
        <Page>
            {isLoading && <LoadingMessage />}
            {isError && <ErrorMessage />}
            {course && <Course course={course} buttonText="Save changes" />}
        </Page>
    )
}