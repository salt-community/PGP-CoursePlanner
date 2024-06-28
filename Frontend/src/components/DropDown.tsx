import { SyntheticEvent } from "react";
import { ModuleType } from "./module/Types";
import { CourseModule } from "./course/Types";

type Props = {
    modules: ModuleType[];
    setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>
    selectedModules: CourseModule[];
    index: number;
    selected: boolean;
    thisCourseModule: CourseModule
}

export default function DropDown({ thisCourseModule, index, selectedModules, modules, setModules, selected}: Props) {

    const handleChange = (event: SyntheticEvent) => {
        const addedModules: CourseModule[] = [...selectedModules];
        const courseModuleToAdd: CourseModule = {
            moduleId: parseInt((event.target as HTMLSelectElement).value),
            module: modules.find(m => m.id == parseInt((event.target as HTMLSelectElement).value))!
        }
        addedModules[index] = courseModuleToAdd!;
        setModules(addedModules);
    }

    return (
        <div className="flex flex-col">
            <select className="border border-gray-300 rounded-lg mt-2 p-1 w-48" onChange={handleChange} defaultValue={'DEFAULT'} >
                {!selected
                    ? <>
                        <option value="DEFAULT" disabled>Select</option>
                        {modules.map(module =>
                            <option key={module.id} value={module.id}>{module.name}</option>)}
                    </>
                    : <>
                        {modules.map(module =>
                            <> {module.id == thisCourseModule.moduleId
                                ? <option key={module.id} value="DEFAULT">{module.name}</option>
                                : <option key={module.id} value={module.id}>{module.name}</option>}
                            </>)}
                    </>}
            </select>

        </div>
    )
}