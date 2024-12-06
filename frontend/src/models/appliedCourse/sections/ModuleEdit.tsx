import { SyntheticEvent, useEffect, useState } from "react";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import TrashBtn from "@components/buttons/TrashBtn";
import AppliedModule from "./AppliedModule";
import { ModuleType } from "@models/module/Types";
import { useQueryModules } from "@api/module/moduleQueries";
import { ReorderModule } from "../components/ReorderModule";
import ErrorMessage from "@components/ErrorMessage";
import LoadingMessage from "@components/LoadingMessage";

interface ModuleEditProps {
    incomingAppliedModules: ModuleType[];
    onUpdateModules: (updatedModules: ModuleType[]) => void;
}

export default function ModuleEdit({ incomingAppliedModules, onUpdateModules }: ModuleEditProps) {
    const [appliedModules, setAppliedModules] = useState<ModuleType[]>([]);
    const { data: modules, isLoading, isError } = useQueryModules();

    useEffect(() => {
        setAppliedModules(incomingAppliedModules);
    }, [incomingAppliedModules]);

    const handleAddAppliedModule = (index: number, event: SyntheticEvent) => {
        if (!modules) return;
        const value = (event.target as HTMLSelectElement).value;
        const id = parseInt(value);
        const module = modules.find(m => m.id === id)!;
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
        updatedModules[index] = newAppliedModule;
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

    const handleSaveAppliedModule = (index: number, appliedModule: ModuleType) => {
        const newAppliedModules = [...appliedModules!];
        newAppliedModules[index] = appliedModule;
        onUpdateModules(newAppliedModules);
    }

    const handleDeleteAppliedModule = (index: number) => {
        const editedModules = [...appliedModules!];
        editedModules.splice(index, 1);
        onUpdateModules(editedModules);
    };

    if (isLoading) return <LoadingMessage />;
    if (isError) return <ErrorMessage />;
    
    return (
        <>
            {appliedModules.map((appliedModule, index) => (
                <div key={appliedModule.id}>
                    <div className="collapse border-primary border mb-2 ">
                        <input
                            type="checkbox"
                            id={`collapse-toggle-${index}`}
                            className="hidden"
                        />
                        <div className="collapse-title flex flex-row justify-between">
                            <div className="flex flex-row">
                                <ReorderModule index={index} appliedModules={appliedModules} setAppliedModules={setAppliedModules} />
                                <label
                                    htmlFor={`collapse-toggle-${index}`}
                                    className="cursor-pointer flex flex-row"
                                >
                                    <h2 className="text-lg text-primary self-center p-3">
                                        {appliedModule.id !== 0 ? `Module ${index + 1}: ${appliedModule.name}` : `Module ${index + 1}`}
                                    </h2>
                                </label>
                                {appliedModule.id === 0 &&
                                    <div className="flex flex-col justify-center ml-1">
                                        <select
                                            className="border border-gray-300 rounded-lg p-1 w-48"
                                            onChange={(event) => handleAddAppliedModule(index, event)}
                                            defaultValue={"DEFAULT"}
                                        >
                                            <option value="DEFAULT" disabled>
                                                Select
                                            </option>
                                            {modules?.map((module) => (
                                                <option
                                                    disabled={appliedModules.some((appliedModule) => appliedModule.name === module.name)}
                                                    key={module.id}
                                                    value={module.id}
                                                >
                                                    {module.name} ({module.numberOfDays} days)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                }
                            </div>
                            <div className="flex flex-row gap-1 items-center">
                                <PrimaryBtn onClick={() => handleCreateNewAppliedModule(index)}>
                                    +
                                </PrimaryBtn>
                                {appliedModules.length > 1 ? (
                                    <TrashBtn handleDelete={() => handleDeleteAppliedModule(index)} />
                                ) : (
                                    <div className="w-12"></div>
                                )}
                            </div>
                        </div>
                        {appliedModule.id !== 0 &&
                            <div className="collapse-content">
                                <AppliedModule
                                    key={appliedModule.id}
                                    module={appliedModule}
                                    index={index}
                                    saveAppliedModule={handleSaveAppliedModule}
                                    buttonText="Save module changes"
                                />
                            </div>
                        }
                    </div>
                </div>
            ))}
        </>
    );
}



