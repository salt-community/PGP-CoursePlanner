import { postCourse } from "@api/CourseApi";
import Page from "@components/Page";
import { getCookie } from "@helpers/cookieHelpers";
import Login from "@models/login/Login";
import Course from "../sections/Course";
import { CourseType } from "../Types";

export default function CreateCourse() {

    const emptyCourse: CourseType =
    {
        name: "",
        numberOfWeeks: 0,
        modules: [],
        moduleIds: [0]
    }

    return (
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                <Course course={emptyCourse} submitFunction={postCourse} buttonText="Create" />
            </Page>
    )
}