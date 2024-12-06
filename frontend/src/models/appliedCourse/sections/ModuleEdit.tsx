import { SyntheticEvent, useEffect, useState } from "react";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import TrashBtn from "@components/buttons/TrashBtn";
import AppliedModule from "./AppliedModule";
import { ModuleType } from "@models/module/Types";
import { useQueryModules } from "@api/module/moduleQueries";
import { ReorderModule } from "../components/ReorderModule";

interface ModuleEditProps {
    incomingAppliedModules: ModuleType[];
    onUpdateModules: (updatedModules: ModuleType[]) => void;
}

export default function ModuleEdit({ incomingAppliedModules, onUpdateModules }: ModuleEditProps) {
    const [appliedModules, setAppliedModules] = useState<ModuleType[]>([]);
    const { data: modules } = useQueryModules();

    useEffect(() => {
        setAppliedModules(incomingAppliedModules);
    }, [incomingAppliedModules]);

    const handleAddAppliedModule = async (event: SyntheticEvent) => {
        const value = (event.target as HTMLSelectElement).value;
        const [moduleIdStr, indexStr] = value.split("_");
        const moduleIndex = parseInt(indexStr);
        const moduleId = parseInt(moduleIdStr);

        if (!modules) {
            return;
        }

        const module = modules[moduleId];
        const newAppliedModule: ModuleType = {
            id: module.id,
            name: module.name,
            numberOfDays: module.numberOfDays,
            days: module.days,
            track: module.track,
            isApplied: true,
            order: module.order
        };
        const updatedModules = [...appliedModules];
        updatedModules[moduleIndex] = newAppliedModule;
        setAppliedModules(updatedModules);
    };

    const handleCreateNewAppliedModule = (index: number) => {
        const emptyModule: ModuleType = {
            id: 0,
            name: "",
            numberOfDays: 1,
            days: [],
            track: [],
            isApplied: true,
            order: 0
        };
        const editedModules = [...appliedModules];
        editedModules.splice(index + 1, 0, emptyModule);
        setAppliedModules(editedModules);
    };

    async function handleSaveAppliedModule(
        index: number,
        appliedModule: ModuleType
    ) {
        const newAppliedModules = [...appliedModules!];
        newAppliedModules[index] = appliedModule;
        onUpdateModules(newAppliedModules);
    }

    const handleDeleteAppliedModule = (index: number) => {
        const editedModules = [...appliedModules!];
        editedModules.splice(index, 1);
        onUpdateModules(editedModules);
    };

    return (
        <>
            {modules &&
                appliedModules.map((appliedModule, index) => (
                    <div key={appliedModule.id}>
                        {appliedModule.name == "" ? (
                            <div className="collapse border-primary border mb-2">
                                <input
                                    type="checkbox"
                                    id={`collapse-toggle-${index}`}
                                    className="hidden"
                                />
                                <div className="collapse-title flex flex-row">
                                    <ReorderModule index={index} appliedModules={appliedModules} onUpdateModules={onUpdateModules} />
                                    <label
                                        htmlFor={`collapse-toggle-${index}`}
                                        className="cursor-pointer flex flex-row"
                                    >
                                        <h1 className="text-lg text-primary">
                                            Module {index + 1}:
                                        </h1>
                                    </label>
                                    <div className="flex flex-col ml-1">
                                        <select
                                            className="border border-gray-300 rounded-lg p-1 w-48"
                                            onChange={handleAddAppliedModule}
                                            defaultValue={"DEFAULT"}
                                        >
                                            <option value="DEFAULT" disabled>
                                                Select
                                            </option>
                                            {modules.map((module) => (
                                                <option
                                                    disabled={appliedModules.some((appliedModule) => appliedModule.name === module.name)}
                                                    key={module.id}
                                                    value={`${module.id}_${index}`}
                                                >
                                                    {module.name} ({module.numberOfDays} days)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/6 flex gap-1 justify-end items-center">
                                        <PrimaryBtn onClick={() => handleCreateNewAppliedModule(index)}>
                                            +
                                        </PrimaryBtn>
                                        {appliedModules.length > 1 ? (
                                            <TrashBtn
                                                handleDelete={() => handleDeleteAppliedModule(index)}
                                            />
                                        ) : (
                                            <div className="w-12"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="collapse border-primary border mb-2 ">
                                <input
                                    type="checkbox"
                                    id={`collapse-toggle-${index}`}
                                    className="hidden"
                                />
                                <div className="collapse-title flex flex-row">
                                    <ReorderModule index={index} appliedModules={appliedModules} onUpdateModules={onUpdateModules} />
                                    <label
                                        htmlFor={`collapse-toggle-${index}`}
                                        className="cursor-pointer flex flex-row w-5/6"
                                    >
                                        <h1 className="text-lg text-primary self-center p-3">
                                            Module {index + 1}: {appliedModule.name}
                                        </h1>
                                    </label>
                                    <div className="w-1/6 flex gap-1 justify-end items-center">
                                        <PrimaryBtn onClick={() => handleCreateNewAppliedModule(index)}>
                                            +
                                        </PrimaryBtn>
                                        {appliedModules.length > 1 ? (
                                            <TrashBtn
                                                handleDelete={() => handleDeleteAppliedModule(index)}
                                            />
                                        ) : (
                                            <div className="w-12"></div>
                                        )}
                                    </div>
                                </div>
                                <div className="collapse-content">
                                    <AppliedModule
                                        key={appliedModule.id}
                                        module={appliedModule}
                                        index={index}
                                        saveAppliedModule={handleSaveAppliedModule}
                                        buttonText="Save module changes"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
        </>
    );
}



