import { useQuery } from "@tanstack/react-query";
import { editCourse, getCourseById } from "@api/courseFetches";
import Page from "@components/Page";
import Course from "../sections/Course";
import { useIdFromPath } from "@helpers/helperHooks";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";

export default function EditCourse() {

    const courseId = useIdFromPath();

    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => getCourseById(courseId)
    });

    return (
        <Page>
            {isLoading && <LoadingMessage />}
            {isError && <ErrorMessage />}
            {course && <Course course={course} submitFunction={editCourse} buttonText="Save changes" />}
        </Page>
    )
}