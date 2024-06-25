import { useQuery } from "react-query";
import { getAllCourses } from "../../api/CourseApi";
import Page from "../../components/Page";
import { Link } from "react-router-dom";


export default function Courses() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['courses'],
        queryFn: getAllCourses
    });

    return (
        <Page>
            <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
                {isLoading && <p>Loading...</p>}
                {isError && <p>An error occured...</p>}
                {data &&
                    <Link to={"/courses/create"} className="border border-black bg-base-300 pb-[100%] relative">
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            Create new course
                        </div>
                    </Link>}
                {data && data.map((course, index) =>
                    <Link to={`/courses/details/${course.id}`} key={course.name + index} className="border border-black pb-[100%] relative">
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            {course.name}
                        </div>
                    </Link>
                )}
            </section>
        </Page>
    )
}