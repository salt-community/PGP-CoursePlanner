import Page from "@components/Page";
import { Link } from "react-router-dom";
import { useQueryCourses } from "@api/course/courseQueries";
import ErrorModal from "@components/ErrorModal";
import Header from "@components/Header";
import { Fragment, useMemo, useState } from "react";
import { useMutationDeleteCourse } from "@api/course/courseMutations";
import LoadingSkeletonCourse from "../components/LoadingSkeletonCourse";

export default function Courses() {
    const { data: courses, isLoading, isError } = useQueryCourses();
    const [trackNames, setTrackNames] = useState<string[]>([]);
    const mutationDeleteCourse = useMutationDeleteCourse();

    useMemo(() => {
        setTrackNames([...new Set(courses?.map((course) => course.track.name))]);
    }, [courses]);

    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">
                    Course Templates
                </h1>
            </Header>
            <section className="flex flex-col gap-4 p-10 pt-0">
                <Link to={"/courses/create"} className="bg-primary w-full rounded-md p-6 drop-shadow-xl text-white hover:bg-[#EF4E72]">
                    <div className="text-lg">
                        Create new course
                    </div>
                </Link>
                {trackNames.map((trackName) =>
                    <Fragment key={trackName}>
                        <h2 className="text-2xl font-semibold mt-4">{trackName}</h2>
                        {courses && courses.map((course, index) =>
                            course.track.name == trackName &&
                            <div key={index} className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                                {!isLoading ?
                                    <LoadingSkeletonCourse />
                                    :
                                    <>
                                        <Link to={`/courses/details/${course.id}`} key={course.name + index} className={`flex justify-between items-center w-full rounded-l-md ${isLoading ? "cursor-default pointer-events-none" : "hover:bg-[#F9F9F9]"}`}>
                                            <h3 className="text-lg p-6">
                                                {course.name}
                                            </h3>
                                            <h4 className="text-sm mr-6 text-[#636363]">
                                                Creation Date: 2024-01-13
                                            </h4>
                                        </Link>
                                        <button
                                            className="bg-red-600 hover:bg-red-700 p-6 px-7 rounded-r-md"
                                            onClick={() => course.id && mutationDeleteCourse.mutate(course.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-7">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </>
                                }
                            </div>
                        )}
                    </Fragment>
                )}
                {!courses &&
                    <>
                        <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                            {isLoading && <LoadingSkeletonCourse />}
                        </div>
                        <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                            {isLoading && <LoadingSkeletonCourse />}
                        </div>
                        <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                            {isLoading && <LoadingSkeletonCourse />}
                        </div>
                    </>
                }
            </section>
            {isError && <ErrorModal error="Courses" />}
        </Page>
    )
}