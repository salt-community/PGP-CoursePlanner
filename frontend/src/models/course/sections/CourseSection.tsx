import DeleteBtn from "@components/buttons/DeleteBtn";
import { Link } from "react-router-dom";
import DeployModal from "./DeployModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ModuleOverview from "./ModuleOverview";
import { getWeekNumberOfModule, numberOfDaysInCourse } from "../helpers/courseUtils";
import { CourseType } from "../../../api/Types";
import { getWeek } from "date-fns";
import PDFDownloadBtn from "@components/buttons/PDFDownloadBtn";

type Props = {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    course: CourseType | undefined
    isLoading: boolean
}

export default function CourseSection({ setOpenModal, course, isLoading }: Props) {
    return (
        <section className="grid grid-rows-[145px_1fr] grid-cols-9 bg-white m-5 mt-0 rounded-lg h-full overflow-auto drop-shadow-xl">
            {/* First Row, First Column */}
            <div className="row-span-1 col-span-2 text-center flex items-center justify-center" style={course && { backgroundColor: course.color }}>
                <h2 className="text-4xl">{course && course.name}</h2>
            </div>

            {/* First Row, Second Column */}
            <div className="row-span-1 col-span-7 text-center flex items-center justify-center border-b-2 relative">
                <h2 className="text-4xl">Modules</h2>
                {course && course.isApplied && course.startDate && course.endDate && (
                    <div className="flex gap-1 justify-center items-center absolute bottom-0 p-4">
                        <p className=" text-[#636363] text-lg">{new Date(course.startDate).toUTCString().slice(5, 16)} - {new Date(course.endDate).toUTCString().slice(5, 16)}</p>
                        <PDFDownloadBtn course={course} color="#636363" size="size-5" />
                    </div>
                )}
            </div>

            {/* Second Row, First Column */}
            <div className="row-span-7 col-span-2 border-r-2 pt-10 px-4 pb-0 flex flex-col">
                {course &&
                    <>
                        <div className="flex place-content-around p-3 pt-0 border-b-4">
                            <div className="flex flex-col items-center">
                                <h3 className="text-2xl font-bold">{course.modules.length}</h3>
                                <p>Modules</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-2xl font-bold">{numberOfDaysInCourse(course)}</h3>
                                <p>Days</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-2xl font-bold">{course.numberOfWeeks}</h3>
                                <p>Weeks</p>
                            </div>
                        </div>

                        <div className="p-7 pb-2 text-center">
                            <h3 className="text-2xl">
                                Module Timeline
                            </h3>
                        </div>

                        <div className="flex-grow overflow-auto">
                            <ul className="timeline timeline-vertical flex flex-col h-full">
                                <li className="flex justify-center">
                                    <p className="py-2 text-sm">
                                        Week
                                    </p>
                                </li>
                                <li className="flex flex-col items-center justify-center">
                                    <div className="bg-accent w-3 h-3 border rounded-lg"></div>
                                </li>
                                {course.modules.map((module, index) => (
                                    <li key={module.module.id}>
                                        <hr />
                                        <button
                                            onClick={() => document.getElementById(module.module.name + module.module.id)?.scrollIntoView({ behavior: "smooth" })}
                                            className={`${index % 2 === 0 ? "timeline-start" : "timeline-end"} timeline-box flex flex-col items-center py-1 px-1 min-w-32 hover:bg-[#cacaca]`}
                                        >
                                            <p className="font-semibold ">
                                                {module.module.name}
                                            </p>
                                            <p className="text-sm">
                                                Days: <span className="font-bold">
                                                    {module.module.days.length}
                                                </span>
                                            </p>
                                        </button>
                                        <div className="timeline-middle">
                                            {(course.isApplied && module.module.startDate) ?
                                                <p className="border rounded px-2">{getWeek(module.module.startDate)}</p>
                                                :
                                                <p className="border rounded px-2">{getWeekNumberOfModule(course, module.module.id!)}</p>
                                            }
                                        </div>
                                        <hr />
                                    </li>
                                ))}
                                <li className="flex-grow flex flex-col items-center justify-center">
                                    <hr />
                                    <div className="bg-accent w-3 h-3 border rounded-lg"></div>
                                </li>
                            </ul>
                        </div>
                    </>
                }
                {isLoading && <LoadingSpinner />}
            </div>

            {/* Second Row, Second Column */}
            <div className="row-span-7 col-span-7 p-10 pt-0 overflow-auto">
                {course && course.modules.map((module, index) =>
                    <ModuleOverview module={module.module} course={course} key={index} />
                )}
                {isLoading && <LoadingSpinner />}
            </div>

            {/* Third Row, First Column */}
            <div className="row-span-1 col-span-2 flex justify-center p-8 border-r-2">
                {course &&
                    <>
                        <button className="btn btn-primary min-w-60 text-xl" onClick={() => (document.getElementById('my_DeployModal_1') as HTMLDialogElement).showModal()}>{course.isApplied ? "Edit Bootcamp" : "Deploy Bootcamp"}</button>
                        <DeployModal course={course} />
                    </>
                }
            </div>

            {/* Third Row, Second Column */}
            <div className="row-span-1 col-span-7 flex p-8 justify-between">
                {course &&
                    <>
                        <div className="flex gap-4">
                            <Link to={course.isApplied ? `/activecourses/edit/${course.id}` : `/courses/edit/${course.id}`} className="btn btn-secondary min-w-52 text-xl">Edit Course</Link>
                            <DeleteBtn onClick={() => setOpenModal(true)} />
                        </div>
                        <div className="flex items-center gap-2 mr-5">
                            <div className="p-2.5 m-1 mask rounded" style={{ backgroundColor: course.track.color }}></div>
                            <p className="text-lg text-[#636363]"> Track: {course.track.name}</p>
                        </div>
                    </>
                }
            </div>
        </section>
    )
}