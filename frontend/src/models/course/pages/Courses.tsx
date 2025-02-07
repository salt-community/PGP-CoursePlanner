import Page from "@components/Page";
import { Link } from "react-router-dom";
import { useQueryCourses } from "@api/course/courseQueries";
import ErrorModal from "@components/ErrorModal";
import Header from "@components/Header";
import { Fragment, useMemo, useState } from "react";
import { useMutationDeleteCourse } from "@api/course/courseMutations";
import LoadingSkeletonCourse from "../components/LoadingSkeletonCourse";
import RectangularCard from "@components/RectangularCard";

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
                {courses && trackNames.map((trackName) =>
                    <Fragment key={trackName}>
                        <h2 className="text-2xl font-semibold mt-4">{trackName}</h2>
                        <RectangularCard data={courses} isLoading={isLoading} trackName={trackName} mutationDelete={mutationDeleteCourse} />
                    </Fragment>
                )}
                {(!courses && isLoading) &&
                    <>
                        <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                            <LoadingSkeletonCourse />
                        </div>
                        <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                            <LoadingSkeletonCourse />
                        </div>
                        <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                            <LoadingSkeletonCourse />
                        </div>
                    </>
                }
            </section>
            {isError && <ErrorModal error="Courses" />}
        </Page>
    )
}