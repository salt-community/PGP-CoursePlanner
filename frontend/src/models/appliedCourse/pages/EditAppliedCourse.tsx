import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import { CourseType, CourseModuleType } from "@models/course/Types";
import { useNavigate } from "react-router-dom";
import Modules from "../components/Modules";
import CourseInfo from "../components/CourseInfo";
import Calendar from "../components/Calendar";

export default function EditAppliedCourse() {
    const appliedCourseId = useIdFromPath();
    const { data: appliedCourse, isLoading, isError } = useQueryAppliedCourseById(appliedCourseId);
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();
    const [isColumn, setIsColumn] = useState(true);

    const toggleLayout = () => {
        setIsColumn(prevState => !prevState);
    }

    const [course, setCourse] = useState<CourseType>({
        name: "",
        startDate: new Date(),
        modules: [],
    });
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
    if (appliedCourse) {
        const sortedModules = appliedCourse.modules
        .map((module) => ({
            moduleId: module.module.id,
            module: module.module,
        }))
        .sort((a, b) => a.module.order - b.module.order); 

        setCourse({
        ...appliedCourse,
        modules: sortedModules,
        });
    }
    }, [appliedCourse]);

    const handleCreateNewAppliedModule = () => {
        const newModule: CourseModuleType = {
            courseId: course.id || 0,
            moduleId: 0,
            module: {
                id: 0,
                name: "New module",
                order: course.modules.length,
                track: [],
                isApplied: false,
                numberOfDays: 0,
                days: [],
                date: new Date().toISOString()
            },
        };

        setCourse((prevCourse) => ({
            ...prevCourse,
            modules: [...prevCourse.modules, newModule],
        }));
    };

    const handleUpdateCourse = () => {
        if (appliedCourse) {
            const updatedCourse = assignDatesToModules(course);
            mutationUpdateAppliedCourse.mutate(updatedCourse);
        }
    };
    function getWeekDayList(startDate: Date, totalDays: number): Date[] {
        const days: Date[] = [];
        const start = new Date(startDate);

        for (let current = new Date(start); days.length < totalDays; current.setDate(current.getDate() + 1)) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) {
                days.push(new Date(current));
            }
        }

        return days;
    }

    function assignDatesToModules(course: CourseType) {
        const totalDays = course.modules.reduce((sum, module) => sum + module.module.days.length, 0);
        const weekdays = getWeekDayList(course.startDate, totalDays);
        
        let dateIndex = 0;
    
        const sortedModules = [...course.modules].sort((a, b) => a.module.order - b.module.order);
    
        const updatedModules = sortedModules.map((module) => {
          
            const moduleDays = weekdays.slice(dateIndex, dateIndex + module.module.days.length);
            dateIndex += module.module.days.length;
    
            const updatedDays = module.module.days.map((existingDay, index) => ({
                ...existingDay,
                date: moduleDays[index].toISOString(), 
            }));
    
            return {
                ...module,
                module: {
                    ...module.module,
                    days: updatedDays,
                },
            };
        });
    
        setCourse({
            ...course,
            modules: updatedModules,
        });
    }
    if (isLoading) {
        return <p>Loading course data...</p>;
    }
    if (isError || !appliedCourse) {
        return <p>There was an error loading the course data.</p>;
    }

    return (
        <Page>
            <div className={`bg-gray-100 min-h-screen flex ${isColumn ? 'flex-col' : 'flex-row'} items-center pt-5`}>
                <section className="px-4 md:px-24 lg:px-56 bg-white rounded-lg p-5 shadow-md mt-5 w-4/5 flex flex-col">
                <PrimaryBtn onClick={toggleLayout}>
                    toggle
                </PrimaryBtn>
                    <Calendar course={course}/>
                </section>
                <section className="px-4 md:px-24 lg:px-56 bg-white rounded-lg p-5 shadow-md mt-5 w-4/5 flex flex-col">
                    <div className="flex flex-row gap-5 mt-2 mb-4">
                        <CourseInfo course={course} setCourse={setCourse} />
                    </div>
                    <div>
                        <Modules course={course} setCourse={setCourse} assignDatesToModules={assignDatesToModules}/>
                    </div>
                    <div>
                        <div className="flex justify-center items-center">
                            <PrimaryBtn onClick={handleCreateNewAppliedModule}>
                                Add Module
                            </PrimaryBtn>
                        </div>
                        <PrimaryBtn onClick={handleUpdateCourse}>Save</PrimaryBtn>
                        <PrimaryBtn onClick={handleGoBack}>Abort</PrimaryBtn>
                    </div>
                </section>
            </div>
        </Page>
    );
}
