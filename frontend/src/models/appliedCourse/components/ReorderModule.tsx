import DownArrowBtn from "@components/buttons/DownArrowBtn";
import { reorderModule } from "../helpers/reorderModule";
import UpArrowBtn from "@components/buttons/UpArrowBtn";
import { ModuleType } from "@models/module/Types";

type Props = {
    index: number,
    appliedModules: ModuleType[],
    onUpdateModules: (modules: ModuleType[]) => void
}

export function ReorderModule({ index, appliedModules, onUpdateModules }: Props) {
    const moveModuleUp = (index: number) => {
        onUpdateModules(reorderModule(appliedModules, index, "up"));
    };
    const moveModuleDown = (index: number) => {
        onUpdateModules(reorderModule(appliedModules, index, "down"));
    };

    return (
        <>
            {index == 0 && index != appliedModules.length - 1 && (
                <div className="flex flex-col w-[26px] mr-2" >
                    <DownArrowBtn onClick={() => moveModuleDown(index)} color={"#3F00E7"} />
                </div>
            )}
            {index != 0 && index == appliedModules.length - 1 && (
                <div className="flex flex-col w-[26px] mr-2">
                    <UpArrowBtn onClick={() => moveModuleUp(index)} color={"#3F00E7"} />
                </div>
            )}
            {index != 0 && index != appliedModules.length - 1 && (
                <div className="flex flex-col w-[26px] mr-2">
                    <UpArrowBtn onClick={() => moveModuleUp(index)} color={"#3F00E7"} />
                    <DownArrowBtn onClick={() => moveModuleDown(index)} color={"#3F00E7"} />
                </div>
            )}
            {index == 0 && index == appliedModules.length - 1 && (
                <div className="flex flex-col w-[26px] mr-2"></div>
            )}
        </>
    )
}