import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllModules } from "../../api/ModuleApi";
import SuccessBtn from "../buttons/SuccessBtn";
import InputSmall from "../inputFields/InputSmall";
import DropDown from "../DropDown";
import PrimaryBtn from "../buttons/PrimaryBtn";
import { FormEvent, useState } from "react";
import DeleteBtn from "../buttons/DeleteBtn";
import { ModuleType } from "../module/Types";
import { CourseProps, CourseType } from "./Types";
import { postCourse } from "../../api/CourseApi";
import { useNavigate } from "react-router-dom";

export default function Course({ submitFunction, course, buttonText }: CourseProps) {
    const [courseName, setCourseName] = useState<string>(course.name);
    const [numOfWeeks, setNumOfWeeks] = useState<number>(course.numberOfWeeks);
    const [courseModules, setCourseModules] = useState<ModuleType[]>(course.modules);
    const navigate = useNavigate();

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    const handleAddModules = () => {
        const newModule: ModuleType = {
            name: "",
            numberOfDays: 0,
            days: []
        }
        const editedModules = [...courseModules];
        editedModules.push(newModule);
        setCourseModules(editedModules);
    }

    const handleDeleteModule = (index: number) => {
        const editedModules = [...courseModules];
        editedModules.splice(index, 1);
        setCourseModules(editedModules);
    }

    const handleNumberOfWeeks = () => {
        // change counter of days filled with modules
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (course: CourseType) => {
            return submitFunction(course);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            navigate(`/courses`)
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { courseName } = e.target as typeof e.target & { courseName: { value: string } };
        const { numberOfWeeks } = e.target as typeof e.target & { numberOfWeeks: { value: number } };

        const newCourse: CourseType = {
            id: course.id ?? 0,
            name: courseName.value,
            numberOfWeeks: numberOfWeeks.value,
            modules: courseModules.value,
        };

        console.log("course to post: ", newCourse);

        mutation.mutate(newCourse);
    }

    console.log("Course modules: ", courseModules);

    return (
        <section className="px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
                    <InputSmall type="text" name="courseName" onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" value={courseName} />
                    <input type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} value={numOfWeeks} className="input input-bordered input-sm max-w-xs" placeholder="Number of weeks" />
                    <PrimaryBtn onClick={handleNumberOfWeeks}>Apply</PrimaryBtn>
                </div>
                {modules && courseModules.map((_num, index) =>
                    <div key={index} className="flex space-x-8">
                        <DropDown index={index} selectedModules={courseModules} modules={modules} setModules={setCourseModules}/>
                        {courseModules.length > 1 &&
                        <DeleteBtn handleDelete={() => handleDeleteModule(index)} />}
                        {index + 1 == courseModules.length &&
                        <PrimaryBtn onClick={handleAddModules}>+</PrimaryBtn>}
                    </div>)}
                <SuccessBtn value={buttonText} />
            </form>
        </section>
    )
}