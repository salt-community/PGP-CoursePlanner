import TrashBtn from "@components/buttons/TrashBtn";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import DropDown from "@components/DropDown";
import { ModuleType } from "@models/module/Types";

interface ModuleRowProps {
    module: ModuleType;
    index: number;
    courseModules: ModuleType[];
    setCourseModules: React.Dispatch<React.SetStateAction<ModuleType[]>>
    filteredModules: ModuleType[];
    onAdd: () => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

export default function ModuleRow({ 
    module, index, courseModules, setCourseModules, 
    filteredModules, onAdd, onDelete, onMoveUp, onMoveDown 
}: ModuleRowProps) {
    return (
        <div className="flex flex-row items-center">
            <div className="flex flex-col w-[26px] mr-2">
                {index > 0 && <button type="button" onClick={onMoveUp}>Up</button>}
                {index < courseModules.length - 1 && <button type="button" onClick={onMoveDown}>Down</button>}
            </div>
            <h2>Module {index + 1}</h2>
            <DropDown
                thisCourseModule={module}
                index={index}
                selectedModules={courseModules}
                modules={filteredModules}
                setSelectedModules={setCourseModules}
                isSelected={module.id !== 0}
            />
            <PrimaryBtn onClick={onAdd}>+</PrimaryBtn>
            {courseModules.length > 1 && <TrashBtn handleDelete={onDelete} />}
        </div>
    );
}