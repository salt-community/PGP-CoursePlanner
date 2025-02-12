import DownArrowBtn from "@components/buttons/DownArrowBtn";
import UpArrowBtn from "@components/buttons/UpArrowBtn";
import { reorderModule } from "@models/appliedCourse/helpers/reorderModule";
import { ModuleType } from "@api/Types";

type Props = {
    index: number,
    appliedModules: ModuleType[],
    setAppliedModules: (modules: ModuleType[]) => void
}

export function ReorderModule({ index, appliedModules, setAppliedModules }: Props) {
    const moveModuleUp = (index: number) => {
        setAppliedModules(reorderModule(appliedModules, index, "up"));
    };
    const moveModuleDown = (index: number) => {
        setAppliedModules(reorderModule(appliedModules, index, "down"));
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