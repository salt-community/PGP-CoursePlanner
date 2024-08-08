import { SyntheticEvent } from "react";
import { CourseModule } from "../models/course/Types";
import { ModuleType } from "../models/module/Types";


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
        <div className="flex flex-col self-center">
            <select className="border border-gray-300 rounded-lg p-1 w-48" onChange={handleChange} defaultValue={'DEFAULT'} >
                {!isSelected
                    ? <>
                        <option value="DEFAULT" disabled>Select</option>
                        {modules.map((module, modIndex) =>
                            <option key={module.id + "," + modIndex} value={module.id}>{module.name} ({module.numberOfDays} days)</option>)}
                    </>
                    : <>
                        {modules.map((module, modIndex) =>
                            <> {module.id == thisCourseModule.moduleId
                                ? <option key={module.id + "," + modIndex} value="DEFAULT">{module.name} ({module.numberOfDays} days)</option>
                                : <option key={module.id + "," + modIndex} value={module.id}>{module.name} ({module.numberOfDays} days)</option>}
                            </>)}
                    </>}
            </select>
        </div>
    )
}