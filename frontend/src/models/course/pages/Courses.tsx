import Page from "@components/Page";
import { Link } from "react-router-dom";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import { useQueryCourses } from "@api/course/courseQueries";
import ErrorModal from "@components/ErrorModal";

export default function Courses() {
    const { data, isLoading, isError } = useQueryCourses();

    return (
        <Page>
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

            {isError && <ErrorModal error="courses" />}

        </Page>
    )
}