import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import { CourseType, CourseModuleType } from "@models/course/Types";
import { useNavigate } from "react-router-dom";
import Modules from "../components/Modules";
import CourseInfo from "../components/CourseInfo";

type Props = {
    course: CourseType
    setCourse: React.Dispatch<React.SetStateAction<CourseType>>
}


export default function EditCourseDays({ course, setCourse }: Props) {
    // const appliedCourseId = useIdFromPath();
    // const { data: appliedCourse, isLoading, isError } = useQueryAppliedCourseById(appliedCourseId);
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();


    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };


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
            }
        };

        setCourse((prevCourse) => ({
            ...prevCourse,
            modules: [...prevCourse.modules, newModule],
        }));
    };
    const handleUpdateCourse = () => {
        if (course) {
            mutationUpdateAppliedCourse.mutate(course);
        }
    };


    if (!course) {
        return <p>There was an error loading the course data.</p>;
    }
    return (
      
            <div className="flex flex-col items-center pt-5">
                <section className="px-4 bg-white rounded-lg p-5 shadow-md mt-5  flex flex-col">
                    <div className="flex flex-row gap-5 mt-2 mb-4">
                        <CourseInfo course={course} setCourse={setCourse} />
                    </div>
                    <div>
                        <Modules course={course} setCourse={setCourse} />
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
    );

}
