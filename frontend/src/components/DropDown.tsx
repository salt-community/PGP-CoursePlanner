import { SyntheticEvent } from "react";
import { CourseModule } from "@models/course/Types";
import { ModuleType } from "@models/module/Types";

type Props = {
    courseId: number | undefined;
    index: number;
    selectedModules: CourseModule[];
    modules: ModuleType[];
    setSelectedModules: React.Dispatch<React.SetStateAction<CourseModule[]>>
    isSelected: boolean;
}

export default function DropDown({ courseId, index, selectedModules, modules, setSelectedModules, isSelected}: Props) {
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
            <select
                className="border border-gray-300 rounded-lg p-1 w-48"
                onChange={handleChange}
                value={isSelected ? courseId : 'DEFAULT'}
            >
                <option value="DEFAULT" disabled>Select</option>
                {modules.map((module, modIndex) => {
                    const isModuleSelectedInAnotherCourse = selectedModules.some(m => m.moduleId === module.id);
                    
                    return (
                        <option
                            key={`${module.id},${modIndex}`}
                            value={module.id}
                            disabled={isModuleSelectedInAnotherCourse && module.id !== courseId}
                        >
                            {module.name} ({module.numberOfDays} days)
                        </option>
                    );
                })}
            </select>
        </div>
    );
}