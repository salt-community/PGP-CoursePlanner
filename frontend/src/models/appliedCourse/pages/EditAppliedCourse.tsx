import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import { CourseType, CourseModuleType} from "@models/course/Types";
import { useNavigate } from "react-router-dom";
import Modules from "../components/Modules";
import CourseInfo from "../components/CourseInfo";

export default function EditAppliedCourse() {
    const appliedCourseId = useIdFromPath();
    const { data: appliedCourse, isLoading, isError } = useQueryAppliedCourseById(appliedCourseId);
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();

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
            setCourse({
                ...appliedCourse,
                modules: appliedCourse.modules.map((module) => ({
                    courseId: appliedCourse.id,
                    moduleId: module.module.id,
                    module: module.module, 
                }))
            });
        }
    }, [appliedCourse]);

    const handleCreateNewAppliedModule = () => {
        const newModule: CourseModuleType = {
            courseId: course.id || 0, 
            moduleId: 0,
            module: {
                id: 0,
                name: "",
                order: 0,
                track: [],
                isApplied: false,
                numberOfDays: 0,
                days: [],
            }
        };

        setCourse((prevCourse) => ({
            ...prevCourse,
            modules: [...prevCourse.modules, newModule], 
        }));
    };
    const handleUpdateCourse = () => {
        if (appliedCourse) {
            mutationUpdateAppliedCourse.mutate(course);
        }
    };

    if (isLoading) {
        return <p>Loading course data...</p>;
    }
    if (isError || !appliedCourse) {
        return <p>There was an error loading the course data.</p>;
    }
    return (
        <Page>
            <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-5">
                <section className="px-4 md:px-24 lg:px-56 bg-white rounded-lg p-5 shadow-md mt-5 w-4/5 flex flex-col">
                    <div className="flex flex-row gap-5 mt-2 mb-4">
                        <CourseInfo course={course} setCourse={setCourse} />
                    </div>
                    <Modules course={course} setCourse={setCourse} />
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
