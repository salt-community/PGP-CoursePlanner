import { ModuleType } from "@models/module/Types";

export const findDuplicates = (modules: Array<ModuleType>): boolean => {
    return modules.some((module, idx) => 
        modules.slice(idx + 1).some(other => other.id === module.id)
    );
};

export const isStringInputIncorrect = (str: string): boolean => {
    return str.trim().length === 0;
};