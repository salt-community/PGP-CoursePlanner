import { AppliedModuleType } from "../Types";

export const reorderModule = (
    modules: AppliedModuleType[],
    index: number,
    direction: "up" | "down"
): AppliedModuleType[] => {
    const newModules = [...modules];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex >= 0 && swapIndex < modules.length) {
        [newModules[index], newModules[swapIndex]] = [
            newModules[swapIndex],
            newModules[index],
        ];
    }

    return newModules;
};