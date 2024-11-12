import { useState } from "react";
import TrashBtn from "../../../components/buttons/TrashBtn";
import InputSmall from "../../../components/inputFields/InputSmall";
import InputSmallTime from "../../../components/inputFields/InputSmallTime";
import { EventProps, ModuleType } from "../Types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editModule, getAllModules } from "../../../api/ModuleApi";
import MoveModalContainer from "./MoveModalContainer";

export default function CalendarEvent({ appliedTrue, editTrue, moduleId, dayNumber, setDays, days, index, event }: EventProps) {
    const [selectedDay, setSelectedDay] = useState<string>("DEFAULT");
    const [selectedModule, setSelectedModule] = useState<string>("DEFAULT");
    const [selectedModuleDay, setSelectedModuleDay] = useState<string>("DEFAULT");
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

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

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return editModule(module);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] })
            setAllToFalse();
            // const form = document.getElementById('editCourse-form') as HTMLFormElement;

            // if (form) {
            //     const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true });
            //     form.dispatchEvent(syntheticEvent);
            // }
        }
    })

    const handleMoveAnotherModule = () => {
        setIsIncompleteInput(false);
        if (selectedModule != "DEFAULT" && selectedModuleDay != "DEFAULT") {
            const originalDayIndex = days.findIndex(d => d.dayNumber == dayNumber);
            days[originalDayIndex].events.splice(index, 1);

            const editedDays = [...days];
            setDays(editedDays);

            const module = modules?.find(m => m.id == parseInt(selectedModule))!;
            const newModule: ModuleType = {
                id: module.id,
                name: module.name,
                numberOfDays: module.numberOfDays,
                days: module.days
            };
            newModule.days.find(d => d.dayNumber == parseInt(selectedModuleDay))?.events.push(event);
            newModule.days.find(d => d.dayNumber == parseInt(selectedModuleDay))?.events.sort((a, b) => {
                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                if (a.endTime < b.endTime) return -1;
                if (a.endTime > b.endTime) return 1;
                return 0;
            });

            mutation.mutate(newModule);
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

    function handleCloseModal() {
        const modal = document.getElementById(`modal-popup-${parseInt(`${dayNumber - 1}${index}`)}`) as HTMLDialogElement;
        modal.close();
        setAllToFalse();
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
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-accent btn-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow">
                            {days.length > 1 &&
                                    <MoveModalContainer openModalText={"Move Event to another Day"} setAllToFalse={setAllToFalse} dayIndex={parseInt(`${dayNumber - 1}${index + 1000}`)}>
                                        <h2 className="m-2 self-center">To which day do you want to move this event?</h2>
                                        <div className="flex flex-col self-center">
                                            <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectDay} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                                {days.map((day, dayIndex) =>
                                                    <> {day.dayNumber == dayNumber
                                                        ? <option key={day.id + "," + dayIndex} value="DEFAULT" disabled>Day {day.dayNumber} ({day.description})</option>
                                                        : <option key={day.id + "," + dayIndex} value={day.dayNumber}>Day {day.dayNumber} ({day.description})</option>}
                                                    </>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-center mb-4 gap-2">
                                            <button className="btn btn-sm mt-4 w-44 btn-success text-white" type="button" onClick={() => { handleMove(); handleCloseModal() }}>Move Event and Save</button>
                                            <button className="btn btn-sm mt-4 w-24 btn-error text-white" type="button" onClick={handleCloseModal}>Cancel</button>
                                        </div>
                                        {isIncompleteInput &&
                                            <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a day</p>}
                                    </MoveModalContainer>
                                }
                                <MoveModalContainer openModalText="Move Event to another Module" setAllToFalse={setAllToFalse} dayIndex={parseInt(`${dayNumber - 1}${index + 2000}`)}>
                                    <h2 className="m-2 self-center">To which module do you want to move this event?</h2>
                                    <div className="flex flex-col self-center">
                                        <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModule} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                            <option key={dayNumber + ",default"} value="DEFAULT" disabled>Select Module</option>
                                            {modules && modules.map((module, moduleIndex) =>
                                                <> {module.id != moduleId &&
                                                    <option key={module.id + ":" + moduleIndex} value={module.id}>{module.name}</option>
                                                }
                                                </>)}
                                        </select>
                                    </div>
                                    {selectedModule != "DEFAULT" &&
                                        <div className="flex flex-col items-center">
                                            <h2 className="m-2 self-center">To which day of this module do you want to move this event?</h2>
                                            <div className="flex flex-col self-center">
                                                <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModuleDay} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                                    <option key={dayNumber + ",defaultDay"} value="DEFAULT" disabled>Select Day</option>
                                                    {modules && modules.find(m => m.id == parseInt(selectedModule))!.days.map((day, dayIndex) =>
                                                        <option key={day.id + "," + dayIndex} value={day.dayNumber}>Day {day.dayNumber} ({day.description})</option>
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
                                            handleMoveAnotherModule(); handleCloseModal()

                                        }}>Move Event and Save</button>
                                        <button className="btn btn-sm mt-4 w-24 btn-error text-white" type="button" onClick={handleCloseModal}>Cancel</button>
                                    </div>
                                    {isIncompleteInput &&
                                        <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a module and a day</p>}
                                </MoveModalContainer>
                        </ul>
                    </div>
                }
            </td>
        </tr >

    )
}