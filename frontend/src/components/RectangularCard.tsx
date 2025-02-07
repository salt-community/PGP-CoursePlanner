import LoadingSkeletonCourse from "@models/course/components/LoadingSkeletonCourse"
import { CourseType } from "@models/course/Types"
import { UseMutationResult } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import DeleteWarningModal from "./DeleteWarningModal"
import { Fragment, useState } from "react"

type Props = {
    data: CourseType[],
    isLoading: boolean,
    trackName?: string,
    mutationDelete: UseMutationResult<void, Error, number, unknown>,
    bootcamps?: boolean
}

export default function RectangularCard({ data, isLoading, trackName, mutationDelete, bootcamps }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [courseId, setCourseId] = useState<number>()

    function handleDeleteCourse() {
        if (courseId) {
            mutationDelete.mutate(courseId);
            if (mutationDelete.isSuccess) {
                setOpenModal(false);
            }
        }
    }

    return (
        <>
            {data && data.map((course, courseIndex) =>
                (course.track.name == trackName || bootcamps) &&
                <Fragment key={courseIndex}>
                    <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                        {isLoading ?
                            <LoadingSkeletonCourse />
                            :
                            <>
                                <Link to={`/${bootcamps ? "activecourses" : "courses"}/details/${course.id}`} className={`flex justify-between items-center w-full rounded-l-md ${isLoading ? "cursor-default pointer-events-none" : "hover:bg-[#F9F9F9]"}`}>
                                    <div className="flex gap-2 p-6 w-96">
                                        <div className="p-2.5 m-1 mask rounded" style={{ backgroundColor: course.color }}></div>
                                        <h3 className="text-lg">
                                            {course.name}
                                        </h3>
                                    </div>
                                    {bootcamps &&
                                        <h3 className="text-lg p-6">
                                            Starting Date: {new Date(course.startDate).toISOString().slice(0, 10)}
                                        </h3>
                                    }
                                    <h4 className="text-sm text-[#636363] text-end p-7 w-96">
                                        Creation Date: 2024-01-13
                                    </h4>
                                </Link>
                                <button
                                    className="bg-red-600 hover:bg-red-700 p-6 px-7 rounded-r-md"
                                    onClick={() => { setOpenModal(true); setCourseId(course.id) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </>
                        }
                    </div>
                    <DeleteWarningModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        warning={course.isApplied ? `${course.name} Bootcamp`:`${course.name} Course Template`}
                        handleDelete={handleDeleteCourse}
                        isError={mutationDelete.isError}
                        errorMessage={mutationDelete.error?.message}
                        resetMutation={mutationDelete.reset}
                    />
                </Fragment>
            )}
        </>
    )
}