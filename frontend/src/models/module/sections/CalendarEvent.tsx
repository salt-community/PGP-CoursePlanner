import { useState } from "react";
import TrashBtn from "@components/buttons/TrashBtn";
import InputSmall from "@components/inputFields/InputSmall";
import InputSmallTime from "@components/inputFields/InputSmallTime";
import ModalContainer from "../components/ModalContainer";
import EllipsisBtn from "../components/EllipsisBtn";
import { openCloseModal } from "../helpers/openCloseModal";
import { useQueryModules } from "@api/module/moduleQueries";
import { useMutationUpdateModule } from "@api/module/moduleMutations";
import { DayType, EventType, ModuleType } from "@api/Types";

export type Props = {
    appliedTrue: boolean;
    editTrue: boolean;
    moduleId: number;
    setDays: React.Dispatch<React.SetStateAction<DayType[]>>;
    days: DayType[];
    index: number;
    dayNumber: number;
    event: EventType;
};

export default function CalendarEvent({ appliedTrue, editTrue, moduleId, dayNumber, setDays, days, index, event }: Props) {
    const [selectedDay, setSelectedDay] = useState<string>("DEFAULT");
    const [selectedModule, setSelectedModule] = useState<string>("DEFAULT");
    const [selectedModuleDay, setSelectedModuleDay] = useState<string>("DEFAULT");
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);
    const { data: modules } = useQueryModules();
    const mutationUpdateModule = useMutationUpdateModule();

    // change event name or description
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const editedDays = [...days];
        editedDays[dayNumber - 1].events[index] = {
            ...editedDays[dayNumber - 1].events[index],
            [name]: value
        }
        setDays(editedDays);
    }

    // change event startTime or endTime
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const editedDays = [...days];

        const correctTime = value.replaceAll(".", ":");
        editedDays[dayNumber - 1].events[index] = {
            ...editedDays[dayNumber - 1].events[index],
            [name]: correctTime
        }
        setDays(editedDays);
    }

    const handleDeleteEvent = () => {
        const editedDays = [...days];
        editedDays[dayNumber - 1].events.splice(index, 1);
        setDays(editedDays);
    }

    let startTimeDefault = event.startTime + ":00";
    if (startTimeDefault.length == 7)
        startTimeDefault = "0" + startTimeDefault;

    let endTimeDefault = event.endTime + ":00";
    if (endTimeDefault.length == 7)
        endTimeDefault = "0" + endTimeDefault;

    const handleSelectDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(event.target.value);
    };

    const handleMove = () => {
        setIsIncompleteInput(false);
        if (selectedDay != "DEFAULT") {
            const originalDayIndex = days.findIndex(d => d.dayNumber == dayNumber);
            const selectedDayIndex = days.findIndex(d => d.dayNumber == parseInt(selectedDay));

            days[originalDayIndex].events.splice(index, 1);
            days[originalDayIndex].events.sort((a, b) => {
                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                if (a.endTime < b.endTime) return -1;
                if (a.endTime > b.endTime) return 1;
                return 0;
            });
            days[selectedDayIndex].events.push(event);
            days[selectedDayIndex].events.sort((a, b) => {
                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                if (a.endTime < b.endTime) return -1;
                if (a.endTime > b.endTime) return 1;
                return 0;
            });

            const editedDays = [...days];
            setDays(editedDays);
            setAllToFalse()
        }
        else {
            setIsIncompleteInput(true);
        }
    };

    const handleSelectModule = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModule(event.target.value);
        setSelectedModuleDay("DEFAULT");
    };

    const handleSelectModuleDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModuleDay(event.target.value);
    };

    const handleMoveAnotherModule = () => {
        setIsIncompleteInput(false);
        const module = modules?.find(m => m.id == parseInt(selectedModule));
        if (module && selectedModuleDay != "DEFAULT") {
            const originalDayIndex = days.findIndex(d => d.dayNumber == dayNumber);
            days[originalDayIndex].events.splice(index, 1);

            const editedDays = [...days];
            setDays(editedDays);

            const newModule: ModuleType = {
                id: module.id,
                name: module.name,
                numberOfDays: module.numberOfDays,
                days: module.days,
                tracks: [],
                creationDate: module.creationDate
            };
            newModule.days.find(d => d.dayNumber == parseInt(selectedModuleDay))?.events.push(event);
            newModule.days.find(d => d.dayNumber == parseInt(selectedModuleDay))?.events.sort((a, b) => {
                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                if (a.endTime < b.endTime) return -1;
                if (a.endTime > b.endTime) return 1;
                return 0;
            });
            mutationUpdateModule.mutate(newModule);
            if (mutationUpdateModule.isSuccess) {
                setAllToFalse();
            }
        }
        else {
            setIsIncompleteInput(true);
        }
    };

    const setAllToFalse = () => {
        setIsIncompleteInput(false);
        setSelectedDay("DEFAULT");
        setSelectedModule("DEFAULT");
        setSelectedModuleDay("DEFAULT");
    }

    return (
        <tr className="gap-2">
            <td><input onChange={handleInputChange} name="name" value={event.name} type="text" placeholder="Event name" className="input input-bordered w-full min-w-[120px] input-sm" /></td>
            <td><InputSmall onChange={handleInputChange} name="description" value={event.description} type="text" placeholder="Description" /></td>
            <td><InputSmallTime onChange={handleTimeChange} name="startTime" value={startTimeDefault} type="time" /></td>
            <td><InputSmallTime onChange={handleTimeChange} name="endTime" value={endTimeDefault} type="time" /></td>
            <td className="text-end flex gap-1">
                <TrashBtn handleDelete={handleDeleteEvent} />
                {!appliedTrue && event.name != "" && event.startTime != "" && event.endTime != "" && editTrue &&
                    <div className="dropdown">
                        <EllipsisBtn />
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow">
                            {days.length > 1 &&
                                <ModalContainer openModalText={"Move Event to another Day"} setAllToFalse={setAllToFalse} id={`${dayNumber - 1}:${event.id}:moveToAnotherDay`}>
                                    <h2 className="m-2 self-center">To which day do you want to move this event?</h2>
                                    <div className="flex flex-col self-center">
                                        <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectDay} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                            {days.map((day) =>
                                                day.dayNumber == dayNumber
                                                    ? <option key={`${day.id}:${event.id}`} value="DEFAULT" disabled>Day {day.dayNumber} ({day.description})</option>
                                                    : <option key={`${day.id}:${event.id}`} value={day.dayNumber}>Day {day.dayNumber} ({day.description})</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-center mb-4 gap-2">
                                        <button className="btn btn-sm mt-4 w-44 btn-success text-white" type="button" onClick={() => { handleMove(); openCloseModal("close", setAllToFalse, `${dayNumber - 1}:${event.id}:moveToAnotherDay`) }}>Move Event and Save</button>
                                        <button className="btn btn-sm mt-4 w-24 btn-error text-white" type="button" onClick={() => openCloseModal("close", setAllToFalse, `${dayNumber - 1}:${event.id}:moveToAnotherDay`)}>Cancel</button>
                                    </div>
                                    {isIncompleteInput &&
                                        <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a day</p>}
                                </ModalContainer>
                            }
                            <ModalContainer openModalText="Move Event to another Module" setAllToFalse={setAllToFalse} id={`${dayNumber - 1}:${event.id}:moveToAnotherModule`}>
                                <h2 className="m-2 self-center">To which module do you want to move this event?</h2>
                                <div className="flex flex-col self-center">
                                    <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModule} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                        <option key={dayNumber + ",default"} value="DEFAULT" disabled>Select Module</option>
                                        {modules && modules.map((module) =>
                                            module.id != moduleId && <option key={`${module.id}:${event.id}`} value={module.id}>{module.name}</option>
                                        )}
                                    </select>
                                </div>
                                {selectedModule != "DEFAULT" &&
                                    <div className="flex flex-col items-center">
                                        <h2 className="m-2 self-center">To which day of this module do you want to move this event?</h2>
                                        <div className="flex flex-col self-center">
                                            <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModuleDay} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                                <option key={dayNumber + ",defaultDay"} value="DEFAULT" disabled>Select Day</option>
                                                {modules && modules.find(m => m.id == parseInt(selectedModule))!.days.map((day) =>
                                                    <option key={`${day.id}:${event.id}`} value={day.dayNumber}>Day {day.dayNumber} ({day.description})</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>}
                                {selectedModule != "DEFAULT" && selectedModuleDay != "DEFAULT" &&
                                    <>
                                        <h2 className="mt-4 self-center font-bold">Moving this event will save all changes!</h2>
                                        <h2 className="mt-4 self-center font-bold">If this module is part of a course, the course will also be modified!</h2>
                                    </>
                                }
                                <div className="flex items-center justify-center mb-4 gap-2">
                                    <button className="btn btn-sm mt-4 w-44 btn-success text-white" type="button" onClick={() => {
                                        handleMoveAnotherModule(); openCloseModal("close", setAllToFalse, `${dayNumber - 1}:${event.id}:moveToAnotherModule`)

                                    }}>Move Event and Save</button>
                                    <button className="btn btn-sm mt-4 w-24 btn-error text-white" type="button" onClick={() => openCloseModal("close", setAllToFalse, `${dayNumber - 1}:${event.id}:moveToAnotherModule`)}>Cancel</button>
                                </div>
                                {isIncompleteInput &&
                                    <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a module and a day</p>}
                            </ModalContainer>
                        </ul>
                    </div>
                }
            </td>
        </tr >

    )
}