import { SyntheticEvent } from "react";
import { ModuleType } from "./module/Types";
import { CourseModule } from "./course/Types";

type Props = {
    thisCourseModule: CourseModule
    index: number;
    selectedModules: CourseModule[];
    modules: ModuleType[];
    setSelectedModules: React.Dispatch<React.SetStateAction<CourseModule[]>>
    isSelected: boolean;
}

export default function DropDown({ thisCourseModule, index, selectedModules, modules, setSelectedModules, isSelected}: Props) {

    const handleChange = (event: SyntheticEvent) => {
        const addedModules: CourseModule[] = [...selectedModules];
        const courseModuleToAdd: CourseModule = {
            moduleId: parseInt((event.target as HTMLSelectElement).value),
            module: modules.find(m => m.id == parseInt((event.target as HTMLSelectElement).value))!
        }
        addedModules[index] = courseModuleToAdd!;
        setSelectedModules(addedModules);
    }

    return (
        <div className="flex flex-col">
            <select className="border border-gray-300 rounded-lg mt-2 p-1 w-48" onChange={handleChange} defaultValue={'DEFAULT'} >
                {!isSelected
                    ? <>
                        <option value="DEFAULT" disabled>Select</option>
                        {modules.map((module, modIndex) =>
                            <option key={module.id + "," + modIndex} value={module.id}>{module.name}</option>)}
                    </>
                    : <>
                        {modules.map((module, modIndex) =>
                            <> {module.id == thisCourseModule.moduleId
                                ? <option value="DEFAULT">{module.name}</option>
                                : <option key={module.id + "," + modIndex} value={module.id}>{module.name}</option>}
                            </>)}
                    </>}
            </select>

        </div>
    )
}