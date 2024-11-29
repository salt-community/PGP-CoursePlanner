import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Page from "@components/Page";
import { deleteAppliedCourse, getAllAppliedCourses } from "@api/AppliedCourseApi";
import DeleteBtn from "@components/buttons/DeleteBtn";
import { Link, useNavigate } from "react-router-dom";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import { useEffect, useState } from "react";
import { CourseType } from "@models/course/Types";

export default function AppliedCourses() {
    const navigate = useNavigate();
    const [activeCourses, setActiveCourses] = useState<CourseType[]>([]);
    const [pastCourses, setPastCourses] = useState<CourseType[]>([]);
    const [futureCourses, setFutureCourses] = useState<CourseType[]>([]);

    const { data: allAppliedCourses, isLoading, isError } = useQuery<CourseType[]>({
        queryKey: ['allAppliedCourses'],
        queryFn: getAllAppliedCourses
    });

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteAppliedCourse(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allAppliedCourses'] })
            navigate(`/activecourses`);
        }
    })

    useEffect(() => {
        if (allAppliedCourses) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tempActiveCourses = allAppliedCourses.filter(ac => { const sd = new Date(ac.startDate); sd.setHours(0, 0, 0, 0); return sd <= today }).filter(ac => { const ed = new Date(ac.endDate!); ed.setHours(0, 0, 0, 0); return ed >= today });
            const tempFutureCourses = allAppliedCourses.filter(ac => { const sd = new Date(ac.startDate); sd.setHours(0, 0, 0, 0); return sd > today })
            const tempPastCourses = allAppliedCourses.filter(ac => { const ed = new Date(ac.endDate!); ed.setHours(0, 0, 0, 0); return ed < today })

            const sortCourses = (activities: CourseType[]): CourseType[] => {
                return activities.sort((a, b) => {
                    const startDateA = new Date(a.startDate!);
                    const startDateB = new Date(b.startDate!);
                    const endDateA = new Date(a.endDate!);
                    const endDateB = new Date(b.endDate!);

                    if (startDateA < startDateB) return -1;
                    if (startDateA > startDateB) return 1;
                    if (endDateA < endDateB) return -1;
                    if (endDateA > endDateB) return 1;
                    return 0;
                });
            };

            const sortedActiveCourses = sortCourses(tempActiveCourses);
            const sortedFutureCourses = sortCourses(tempFutureCourses);
            const sortedPastCourses = sortCourses(tempPastCourses);

            setActiveCourses(sortedActiveCourses);
            setFutureCourses(sortedFutureCourses);
            setPastCourses(sortedPastCourses)
        }
    }, [allAppliedCourses])

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
            <Page>
                <section className="px-4 pb-10 md:px-24 lg:px-56">
                    {isLoading && <LoadingMessage />}
                    {isError && <ErrorMessage />}
                    {allAppliedCourses
                        && <>
                            {allAppliedCourses && activeCourses.length > 0
                                ? <>
                                    <h1 className="text-xl text-primary mb-2 font-bold">Active bootcamps</h1>
                                    {activeCourses.map((appliedCourse, index) =>

                                        <div key={index} className="border-primary border rounded-xl mb-2">
                                            <div className="collapse-title flex flex-col w-full gap-4">
                                                <Link to={`/activecourses/details/${appliedCourse.id}`} className="text-lg font-bold mb-2">{appliedCourse.name} ({new Date(appliedCourse.startDate).getDate()} {monthNames[new Date(appliedCourse.startDate).getMonth()]} {new Date(appliedCourse.startDate).getFullYear()} - {new Date(appliedCourse.endDate!).getDate()} {monthNames[new Date(appliedCourse.endDate!).getMonth()]} {new Date(appliedCourse.endDate!).getFullYear()})</Link>
                                                <div className="flex flex-row">
                                                    <div className=" flex flex-row w-1/2">
                                                        <h2 className=" text-lg flex items-center">Calendar color:
                                                            <div style={{ backgroundColor: appliedCourse.color }} className="w-5 h-5 ml-2"></div>
                                                        </h2>
                                                    </div>
                                                    <div className="w-1/2 flex flex-row items-end justify-end gap-12">
                                                        <div className="flex flex-row gap-1">
                                                            <Link to={`/activecourses/edit/${appliedCourse.id}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit</Link>
                                                            <DeleteBtn onClick={() => mutation.mutate(parseInt(appliedCourse.id!.toString()))}>Delete</DeleteBtn>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                    <div className="border border-1 border-gray-200 mt-6"></div>
                                </>
                                : <>
                                    <h1 className="text-xl font-bold text-primary mb-2">Active bootcamps</h1>
                                    <h1 className="text-lg">No active bootcamps</h1>
                                    <div className="border border-1 border-gray-200 mt-6"></div>
                                </>}
                            {allAppliedCourses && futureCourses.length > 0
                                ? <>
                                    <h1 className="text-xl text-black mt-6 mb-2">Future bootcamps</h1>
                                    {futureCourses.map((appliedCourse, index) =>

                                        <div key={index} className="border-black border rounded-xl mb-2">
                                            <div className="collapse-title flex flex-col w-full gap-4">
                                                <Link to={`/activecourses/details/${appliedCourse.id}`} className="text-lg font-bold mb-2">{appliedCourse.name} ({new Date(appliedCourse.startDate).getDate()} {monthNames[new Date(appliedCourse.startDate).getMonth()]} {new Date(appliedCourse.startDate).getFullYear()} - {new Date(appliedCourse.endDate!).getDate()} {monthNames[new Date(appliedCourse.endDate!).getMonth()]} {new Date(appliedCourse.endDate!).getFullYear()})</Link>
                                                <div className="flex flex-row">
                                                    <div className=" flex flex-row w-1/2">
                                                        <h2 className=" text-lg flex items-center">Calendar color:
                                                            <div style={{ backgroundColor: appliedCourse.color }} className="w-5 h-5 ml-2"></div>
                                                        </h2>
                                                    </div>
                                                    <div className="w-1/2 flex flex-row items-end justify-end gap-12">
                                                        <div className="flex flex-row gap-1">
                                                            <Link to={`/activecourses/edit/${appliedCourse.id}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit</Link>
                                                            <DeleteBtn onClick={() => mutation.mutate(parseInt(appliedCourse.id!.toString()))}>Delete</DeleteBtn>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                    <div className="border border-1 border-gray-200 mt-6"></div>
                                </>
                                : <>
                                    <h1 className="text-xl text-black mt-8 mb-2">Future bootcamps</h1>
                                    <h1 className="text-lg">No future bootcamps</h1>
                                    <div className="border border-1 border-gray-200 mt-6"></div>
                                </>}
                            {allAppliedCourses && pastCourses.length > 0
                                ? <>
                                    <h1 className="text-xl text-black mt-6 mb-2">Completed bootcamps</h1>
                                    {pastCourses.map((appliedCourse, index) =>

                                        <div key={index} className="border-black border rounded-xl mb-2">
                                            <div className="collapse-title flex flex-col w-full gap-4">
                                                <Link to={`/activecourses/details/${appliedCourse.id}`} className="text-lg font-bold mb-2">{appliedCourse.name} ({new Date(appliedCourse.startDate).getDate()} {monthNames[new Date(appliedCourse.startDate).getMonth()]} {new Date(appliedCourse.startDate).getFullYear()} - {new Date(appliedCourse.endDate!).getDate()} {monthNames[new Date(appliedCourse.endDate!).getMonth()]} {new Date(appliedCourse.endDate!).getFullYear()})</Link>
                                                <div className="flex flex-row">
                                                    <div className=" flex flex-row w-1/2">
                                                        <h2 className=" text-lg flex items-center">Calendar color:
                                                            <div style={{ backgroundColor: appliedCourse.color }} className="w-5 h-5 ml-2"></div>
                                                        </h2>
                                                    </div>
                                                    <div className="w-1/2 flex flex-row items-end justify-end gap-12">
                                                        <div className="flex flex-row gap-1">
                                                            <Link to={`/activecourses/edit/${appliedCourse.id}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit</Link>
                                                            <DeleteBtn onClick={() => mutation.mutate(parseInt(appliedCourse.id!.toString()))}>Delete</DeleteBtn>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                </>
                                : <>
                                    <h1 className="text-xl text-black mt-8 mb-2">Completed bootcamps</h1>
                                    <h1 className="text-lg">No completed bootcamps</h1>
                                </>}
                        </>
                    }
                </section>
            </Page >
    )
}