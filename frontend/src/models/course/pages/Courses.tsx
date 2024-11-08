import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "../../../api/CourseApi";
import Page from "../../../components/Page";
import { Link } from "react-router-dom";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";
import { trackUrl } from "../../../helpers/helperMethods";

export default function Courses() {
    trackUrl();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['courses'],
        queryFn: getAllCourses
    });

    return (
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-24 lg:px-56">
                    {isLoading && <LoadingMessage />}
                    {isError && <ErrorMessage />}
                    {data &&
                        <Link to={"/courses/create"} className="border border-primary bg-primary text-white pb-[100%] relative">
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                                Create new course
                            </div>
                        </Link>}
                    {data && data.map((course, index) =>
                        <Link to={`/courses/details/${course.id}`} key={course.name + index} className="border border-black pb-[100%] relative">
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
                                <h1 className="text-primary">{course.name}</h1>
                            </div>
                        </Link>
                    )}
                </section>
            </Page>
    )
}