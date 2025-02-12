import Page from "@components/Page";
import { useEffect, useState } from "react";
import { CourseType } from "@api/Types";
import { useQueryAppliedCourses } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationDeleteAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import Header from "@components/Header";
import RectangularCard from "@components/RectangularCard";
import LoadingSkeletonCourse from "@models/course/components/LoadingSkeletonCourse";
import ErrorModal from "@components/ErrorModal";

export default function AppliedCourses() {
    const [activeCourses, setActiveCourses] = useState<CourseType[]>([]);
    const [pastCourses, setPastCourses] = useState<CourseType[]>([]);
    const [futureCourses, setFutureCourses] = useState<CourseType[]>([]);
    const { data: appliedCourses, isLoading, isError } = useQueryAppliedCourses();
    const mutationDeleteAppliedCourse = useMutationDeleteAppliedCourse();

    useEffect(() => {
        if (appliedCourses) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tempActiveCourses = appliedCourses.filter(ac => { const sd = new Date(ac.startDate); sd.setHours(0, 0, 0, 0); return sd <= today }).filter(ac => { const ed = new Date(ac.endDate!); ed.setHours(0, 0, 0, 0); return ed >= today });
            const tempFutureCourses = appliedCourses.filter(ac => { const sd = new Date(ac.startDate); sd.setHours(0, 0, 0, 0); return sd > today })
            const tempPastCourses = appliedCourses.filter(ac => { const ed = new Date(ac.endDate!); ed.setHours(0, 0, 0, 0); return ed < today })

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
    }, [appliedCourses])

    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">
                    Bootcamps
                </h1>
            </Header>

            <section className="flex flex-col gap-4 p-10 pt-0">
                <h2 className="text-2xl font-semibold mt-4 gap-4">
                    Active Bootcamps
                </h2>
                {activeCourses.length !== 0 ?
                    <RectangularCard data={activeCourses} isLoading={isLoading} bootcamps={true} mutationDelete={mutationDeleteAppliedCourse} />
                    :
                    <p className="text-lg ml-2">
                        No Active Bootcamps
                    </p>
                }
                {isLoading &&
                    <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                        <LoadingSkeletonCourse />
                    </div>
                }
                <h2 className="text-2xl font-semibold mt-4 gap-4">
                    Upcoming Bootcamps
                </h2>
                {futureCourses.length !== 0 ?
                    <RectangularCard data={futureCourses} isLoading={isLoading} bootcamps={true} mutationDelete={mutationDeleteAppliedCourse} />
                    :
                    <p className="text-lg ml-2">
                        No Upcoming Bootcamps
                    </p>
                }
                {(isLoading) &&
                    <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                        <LoadingSkeletonCourse />
                    </div>
                }
                <h2 className="text-2xl font-semibold mt-4 gap-4">
                    Completed Bootcamps
                </h2>
                {pastCourses.length !== 0 ?
                    <RectangularCard data={pastCourses} isLoading={isLoading} bootcamps={true} mutationDelete={mutationDeleteAppliedCourse} />
                    :
                    <p className="text-lg ml-2">
                        No Completed Bootcamps
                    </p>
                }
                {(isLoading) &&
                    <div className="flex justify-between items-center bg-white w-full rounded-md drop-shadow-xl">
                        <LoadingSkeletonCourse />
                    </div>
                }
            </section>
            {isError && <ErrorModal error="Bootcamps" />}
        </Page >
    )
}