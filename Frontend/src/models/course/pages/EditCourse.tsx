import { useQuery } from "@tanstack/react-query";
import { editCourse, getCourseById } from "../../../api/CourseApi";
import Page from "../../../components/Page";
import Course from "../sections/Course";
import { getIdFromPath } from "../../../helpers/helperMethods";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";

export default function () {

    const courseId = getIdFromPath();

    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => getCourseById(parseInt(courseId))
    });

    return (
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                {isLoading && <LoadingMessage />}
                {isError && <ErrorMessage />}
                {course && <Course course={course} submitFunction={editCourse} buttonText="Save changes" />}
            </Page>
    )
}