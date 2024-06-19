import { SyntheticEvent } from "react";
import { ModuleType } from "./module/Types";

type Props = {
    modules: ModuleType[];
    setModules: React.Dispatch<React.SetStateAction<ModuleType[]>>
}

export default function DropDown({modules, setModules }: Props) {

    const handleChange = (event: SyntheticEvent) => {
        const editedModules = [...modules];
        const moduleToAdd = editedModules.find(module => module.id == parseInt((event.target as HTMLSelectElement).value));
        moduleToAdd && editedModules.push(moduleToAdd);
        setModules(editedModules);
    }
    return (
        <div className="flex flex-col justify-center">
            <select className="border border-gray-300 rounded-lg mt-2 max-w-xs p-1" onChange={handleChange} >
                {modules.map(module =>
                    <option value={module.id}>{module.name}</option>)}
            </select>

        </div>
    )
}