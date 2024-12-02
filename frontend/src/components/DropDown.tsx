import { SyntheticEvent } from "react";
import { ModuleType } from "@models/module/Types";

type Props = {
    thisCourseModule: ModuleType;
    index: number;
    selectedModules: ModuleType[];
    modules: ModuleType[];
    setSelectedModules: React.Dispatch<React.SetStateAction<ModuleType[]>>
    isSelected: boolean;
}

export default function DropDown({ thisCourseModule, index, selectedModules, modules, setSelectedModules, isSelected }: Props) {
    const handleChange = (event: SyntheticEvent) => {
        const addedModules: ModuleType[] = [...selectedModules];
        const courseModuleToAdd: ModuleType = {
            id: parseInt((event.target as HTMLSelectElement).value),
            name: thisCourseModule.name,
            numberOfDays: thisCourseModule.numberOfDays,
            days: thisCourseModule.days
        }
        addedModules[index] = courseModuleToAdd!;
        setSelectedModules(addedModules);
    }

    return (
        <div className="flex flex-col self-center">
            <select
                className="border border-gray-300 rounded-lg p-1 w-48"
                onChange={handleChange}
                value={isSelected ? thisCourseModule.id : 'DEFAULT'}
            >
                <option value="DEFAULT" disabled>Select</option>
                {modules.map((module, modIndex) => {
                    const isModuleSelectedInAnotherCourse = selectedModules.some(m => m.id === module.id);

                    return (
                        <option
                            key={`${module.id},${modIndex}`}
                            value={module.id}
                            disabled={isModuleSelectedInAnotherCourse && module.id !== thisCourseModule.id}
                        >
                            {module.name} ({module.numberOfDays} days)
                        </option>
                    );
                })}
            </select>
        </div>
    );
}