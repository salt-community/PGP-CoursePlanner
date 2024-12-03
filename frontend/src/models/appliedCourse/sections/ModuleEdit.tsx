import { SyntheticEvent } from "react";
import { reorderModule } from "../helpers/reorderModule";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import TrashBtn from "@components/buttons/TrashBtn";
import AppliedModule from "./AppliedModule";
import { postAppliedModule, updateAppliedModule } from "@api/appliedModuleApi";
import { postAppliedDay } from "@api/appliedDayApi";
import { postAppliedEvent } from "@api/appliedEventApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllModules } from "@api/ModuleApi";
import UpArrowBtn from "@components/buttons/UpArrowBtn";
import DownArrowBtn from "@components/buttons/DownArrowBtn";
import { DayType, EventType, ModuleType } from "@models/module/Types";

interface ModuleEditProps {
    appliedModules: ModuleType[];
    onUpdateModules: (updatedModules: ModuleType[]) => void;
}

export default function ModuleEdit({ appliedModules, onUpdateModules }: ModuleEditProps) {

    const { data: modules, isLoading, error } = useQuery<ModuleType[]>({
        queryKey: ["modules"],
        queryFn: getAllModules,
    });

    const queryClient = useQueryClient();
    const eventMutation = useMutation({
        mutationFn: (newEvent: EventType) => {
            return postAppliedEvent(newEvent);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedModules'] })
        }
    })

    const dayMutation = useMutation({
        mutationFn: (dayType: DayType) => {
            return postAppliedDay(dayType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedModules'] })
        }
    })

    const appliedModuleMutation = useMutation({
        mutationFn: (newAppliedModule: ModuleType) => {
            return updateAppliedModule(newAppliedModule);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedModules'] })
        }
    })

    const postAppliedModuleMutation = useMutation({
        mutationFn: (emptyModule: ModuleType) => {
            return postAppliedModule(emptyModule);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedModules'] })
        }
    })

    if (isLoading) return <p>Loading modules...</p>;
    if (error) return <p>Error loading modules</p>;

    const handleChange = async (event: SyntheticEvent) => {
        const value = (event.target as HTMLSelectElement).value;
        const [moduleId, indexStr, appModuleId] = value.split("_");
        const moduleIndex = parseInt(indexStr);
        const appliedModuleId = parseInt(appModuleId);

        if (!modules) {
            console.error("Modules data is loading");
            return;
        }
        const module = modules.find((m) => m.id === parseInt(moduleId));
        if (!module) {
            console.error("Sorry Module Not Found");
            return;
        }

        const listDays: DayType[] = [];

        await Promise.all(
            module.days.map(async (day) => {
                const listEvents: EventType[] = [];
                await Promise.all(
                    day.events.map(async (eventItem) => {
                        try {
                            const newEvent = {
                                id: 0,
                                name: eventItem.name,
                                description: eventItem.description,
                                startTime: eventItem.startTime,
                                endTime: eventItem.endTime,
                            };
                            eventMutation.mutate(newEvent);
                            if (eventMutation.data) listEvents.push(eventMutation.data);
                        } catch (error) {
                            console.error("Error posting applied event:", error);
                        }
                    })
                );

                const newDay = {
                    id: 0,
                    dayNumber: day.dayNumber,
                    description: day.description,
                    events: listEvents,
                };

                try {
                    dayMutation.mutate(newDay);
                    if (dayMutation.data) listDays.push(dayMutation.data);
                } catch (error) {
                    console.error("Error posting applied day:", error);
                }
            })
        );
        const newAppliedModule: ModuleType = {
            id: appliedModuleId,
            name: module.name,
            numberOfDays: listDays.length,
            days: listDays.sort((a, b) => a.dayNumber - b.dayNumber),
        };

        appliedModuleMutation.mutate(newAppliedModule)
        if (appliedModuleMutation.data) {
            const updatedModules = [...appliedModules!];
            updatedModules[moduleIndex] = newAppliedModule;
            onUpdateModules(updatedModules);
        }
    };

    async function editAppliedModule(
        index: number,
        appliedModule: ModuleType
    ) {
        const newAppliedModules = [...appliedModules!];
        newAppliedModules[index] = appliedModule;
        onUpdateModules(newAppliedModules);
    }

    const handleAddModule = (index: number) => {
        const emptyModule: ModuleType = {
            id: 0,
            name: "",
            numberOfDays: 1,
            days: [],
        };

        postAppliedModuleMutation.mutate(emptyModule)
        if (postAppliedModuleMutation.data) {
            const editedModules = [...appliedModules!];
            editedModules.splice(index + 1, 0, postAppliedModuleMutation.data);
            onUpdateModules(editedModules);
        }
    };

    const handleDeleteModule = (index: number) => {
        const editedModules = [...appliedModules!];
        editedModules.splice(index, 1);
        onUpdateModules(editedModules);
    };

    const moveModuleUp = (index: number) => {
        onUpdateModules(reorderModule(appliedModules, index, "up"));
    };
    const moveModuleDown = (index: number) => {
        onUpdateModules(reorderModule(appliedModules, index, "down"));
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
                                            onChange={handleChange}
                                            defaultValue={"DEFAULT"}
                                        >
                                            <option value="DEFAULT" disabled>
                                                Select Topic
                                            </option>
                                            {modules.map((module) => (
                                                <option
                                                    key={module.id}
                                                    value={`${module.id}_${index}_${appliedModule.id}`}
                                                >
                                                    {module.name} ({module.numberOfDays} days)
                                                </option>
                                            ))}
                                        </select>
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
                                    <label
                                        htmlFor={`collapse-toggle-${index}`}
                                        className="cursor-pointer flex flex-row w-5/6"
                                    >
                                        <h1 className="text-lg text-primary self-center p-3">
                                            Module {index + 1}: {appliedModule.name}
                                        </h1>
                                    </label>
                                    <div className="w-1/6 flex gap-1 justify-end items-center">
                                        <PrimaryBtn onClick={() => handleAddModule(index)}>
                                            +
                                        </PrimaryBtn>
                                        {appliedModules.length > 1 ? (
                                            <TrashBtn
                                                handleDelete={() => handleDeleteModule(index)}
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
                                        submitFunction={editAppliedModule}
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



