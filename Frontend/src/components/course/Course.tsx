import { useQuery } from "react-query";
import { getAllModules } from "../../api/ModuleApi";
import SuccessBtn from "../buttons/SuccessBtn";
import InputSmall from "../inputFields/InputSmall";
import DropDown from "../DropDown";
import PrimaryBtn from "../buttons/PrimaryBtn";
import { FormEvent, useState } from "react";
import DeleteBtn from "../buttons/DeleteBtn";
import { ModuleType } from "../module/Types";
import { CourseType } from "./Types";
import { postCourse } from "../../api/CourseApi";

export default function Course() {
    const newModule: ModuleType = {
        name: "",
        numberOfDays: 0,
        days: []
    }
    const [courseModules, setCourseModules] = useState<ModuleType[]>([newModule]);


    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    const handleAddModules = () => {
        const editedModules = [...courseModules];
        editedModules.push(newModule);
        setCourseModules(editedModules);
    }

    const handleDeleteModule = (index: number) => {
        const editedModules = [...courseModules];
        editedModules.splice(index, 1);
        setCourseModules(editedModules);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { courseName } = e.target as typeof e.target & { courseName: { value: string } };
        const { numberOfWeeks } = e.target as typeof e.target & { numberOfWeeks: { value: number } };

        const newCourse: CourseType = {
            name: courseName.value,
            numberOfWeeks: numberOfWeeks.value,
            modules: courseModules,
        };

        postCourse(newCourse);
    }

    console.log("Course modules: ", courseModules);

    return (
        <section className="px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
                    <InputSmall type="text" name="courseName" placeholder="Course name" />
                    <InputSmall type="number" name="numberOfWeeks" placeholder="Number of weeks" onChange={(e) => e} />
                    <button type="button" className="btn btn-sm max-w-48 btn-primary">Apply</button>
                </div>

                {modules && courseModules.map((num, index) =>
                    <div key={index} className="flex space-x-8">
                        <DropDown index={index} selectedModules={courseModules} modules={modules} setModules={setCourseModules} />
                        <DeleteBtn handleDelete={() => handleDeleteModule(index)} />
                        {index + 1 == courseModules.length &&
                            <PrimaryBtn onClick={handleAddModules}>+</PrimaryBtn>}
                    </div>)}



                <SuccessBtn value="Create Course" />
            </form>
        </section>
    )
}