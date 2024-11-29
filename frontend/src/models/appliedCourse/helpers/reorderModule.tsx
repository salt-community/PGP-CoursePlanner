import { ModuleType } from "@models/module/Types";

export const reorderModule = (
    modules: ModuleType[],
    index: number,
    direction: "up" | "down"
): ModuleType[] => {
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