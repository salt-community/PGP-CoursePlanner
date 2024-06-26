import { SyntheticEvent } from "react";
import { ModuleType } from "./module/Types";
import { CourseModule, CourseType } from "./course/Types";

type Props = {
    modules: ModuleType[];
    setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>
    selectedModules: CourseModule[];
    index: number;
    isCreate: boolean;
}

export default function DropDown({ index, selectedModules, modules, setModules, isCreate }: Props) {

    const handleChange = (event: SyntheticEvent) => {
        const addedModules: CourseModule[] = [...selectedModules];
        const courseModuleToAdd: CourseModule = {
            moduleId: parseInt((event.target as HTMLSelectElement).value),
            module: modules.find(m => m.id == parseInt((event.target as HTMLSelectElement).value))!
        }
        //const courseModuleToAdd = courseModules.find(module => module.moduleId == parseInt((event.target as HTMLSelectElement).value));
        addedModules[index] = courseModuleToAdd!;
        setModules(addedModules);
    }

    return (
        <div className="flex flex-col justify-center">
            <select className="border border-gray-300 rounded-lg mt-2 max-w-xs p-1" onChange={handleChange} defaultValue={'DEFAULT'} >
                {isCreate
                    ? <>
                        <option value="DEFAULT" disabled>Select</option>
                        {modules.map(module =>
                            <option key={module.id} value={module.id}>{module.name}</option>)}
                    </>
                    : <>
                        {modules.map(module =>
                            <> {module.id == selectedModules[index].moduleId
                                ? <option key={module.id} value="DEFAULT">{module.name}</option>
                                : <option key={module.id} value={module.id}>{module.name}</option>}
                            </>)}
                    </>}
            </select>

        </div>
    )
}