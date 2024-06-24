import { useQuery } from "react-query";
import { getAllModules } from "../../api/ModuleApi";
import SuccessBtn from "../buttons/SuccessBtn";
import InputSmall from "../inputFields/InputSmall";
import DropDown from "../DropDown";
import PrimaryBtn from "../buttons/PrimaryBtn";
import { useState } from "react";
import DeleteBtn from "../buttons/DeleteBtn";
import { ModuleType } from "../module/Types";

export default function Course() {
    const [numberOfModules, setNumberOfModules] = useState<number[]>([0]);
    const [courseModules, setCourseModules] = useState<ModuleType[]>([]);
    

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    // const moduleNames: string[] = [];

    // if (modules) {
    //     modules.forEach(module => moduleNames.push(module.name));
    // }

    const handleAddModules = () => {
        const editedModules = [...numberOfModules];
        editedModules.push(1);
        setNumberOfModules(editedModules);
    }

    const handleDeleteModule = () => {
        const editedModules = [...numberOfModules];
        editedModules.pop();
        setNumberOfModules(editedModules);
    }

    console.log("Course modules: ", courseModules);

    return (
        <section className="px-4">
            <form className="flex flex-col gap-4 ">
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
                    <InputSmall type="text" name="moduleName" placeholder="Course name" />
                    <InputSmall type="number" name="numberOfDays" placeholder="Number of weeks" onChange={(e) => e}/>
                    <button type="button" className="btn btn-sm max-w-48 btn-primary">Apply</button>
                </div>

                {modules && numberOfModules.map((num, index) =>
                    <div key={index} className="flex space-x-8">
                        <DropDown modules={modules} setModules={setCourseModules} />
                        <DeleteBtn handleDelete={handleDeleteModule}/>
                        {index + 1 == numberOfModules.length &&
                            <PrimaryBtn onClick={handleAddModules}>+</PrimaryBtn>}
                    </div>)}



                <SuccessBtn value="Create Course" />
            </form>
        </section>
    )
}