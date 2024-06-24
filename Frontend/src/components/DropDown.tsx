import { SyntheticEvent } from "react";
import { ModuleType } from "./module/Types";

type Props = {
    modules: ModuleType[];
    setModules: React.Dispatch<React.SetStateAction<ModuleType[]>>
}

export default function DropDown({modules, setModules }: Props) {

    const handleChange = (event: SyntheticEvent) => {
        const addedModules: ModuleType[] = [];
        const moduleToAdd = modules.find(module => module.id == parseInt((event.target as HTMLSelectElement).value));
        moduleToAdd && addedModules.push(moduleToAdd);
        setModules(addedModules);
    }
    return (
        <div className="flex flex-col justify-center">
            <select className="border border-gray-300 rounded-lg mt-2 max-w-xs p-1" onChange={handleChange} >
                {modules.map(module =>
                    <option key={module.id} value={module.id}>{module.name}</option>)}
            </select>

        </div>
    )
}