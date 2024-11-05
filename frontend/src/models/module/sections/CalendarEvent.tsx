import { useEffect, useRef, useState } from "react";
import TrashBtn from "../../../components/buttons/TrashBtn";
import InputSmall from "../../../components/inputFields/InputSmall";
import InputSmallTime from "../../../components/inputFields/InputSmallTime";
import { EventProps, ModuleType } from "../Types";
import Popup from "reactjs-popup";
import CloseBtn from "../../../components/buttons/CloseBtn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editModule, getAllModules } from "../../../api/ModuleApi";

export default function CalendarEvent({ appliedTrue, editTrue, moduleId, dayNumber, setDays, days, index, event }: EventProps) {
    const [isMove, setIsMove] = useState<boolean>(false);
    const [isMoveAnotherModule, setIsMoveAnotherModule] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const popupRefAnotherModule = useRef<HTMLDivElement>(null);
    const [showOptions, setShowOptions] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
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

    // handle clicking the three dots button
    const handleClick = () => {
        setAllToFalse();
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setPopupPosition({
                top: buttonRect.bottom,
                left: buttonRect.left
            });
        }
        setShowOptions(!showOptions);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as Node;
        if (optionsRef.current && !optionsRef.current.contains(target) && !buttonRef.current?.contains(target)) {
            setShowOptions(false);
        }
    };

    const handleScroll = () => {
        setShowOptions(false);
    };

    useEffect(() => {
        if (showOptions) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('scroll', handleScroll, true);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [showOptions]);

    // handle clicking outside popup moveEvent
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setAllToFalse();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    // handle clicking outside popup moveEventToAnotherModule
    useEffect(() => {
        function handleClickOutsideAnotherModule(event: MouseEvent) {
            if (popupRefAnotherModule.current && !popupRefAnotherModule.current.contains(event.target as Node)) {
                setAllToFalse();
            }
        }
        document.addEventListener('mousedown', handleClickOutsideAnotherModule);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideAnotherModule);
        };
    }, []);

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
            const form = document.getElementById('editCourse-form') as HTMLFormElement;

            if (form) {
                const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(syntheticEvent);
            }
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
        setIsMove(false);
        setIsMoveAnotherModule(false);
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
                    <div className="relative inline-block">
                        <button
                            ref={buttonRef}
                            type="button"
                            onClick={handleClick}
                            className="btn btn-sm max-w-48 bg-white border-black"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                        </button>
                        {showOptions && popupPosition && (
                            <div
                                ref={optionsRef}
                                className="fixed w-60 bg-white border border-gray-200 shadow-lg rounded-md z-50"
                                style={{
                                    top: popupPosition.top,
                                    left: popupPosition.left
                                }}
                            >
                                <ul className="py-1">
                                    {days.length > 1 &&
                                        <li>
                                            <Popup
                                                open={isMove}
                                                onOpen={() => setIsMove(true)}
                                                onClose={setAllToFalse}
                                                trigger={<button
                                                    type="button"
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Move Event to another Day
                                                </button>}
                                                modal
                                            >
                                                {
                                                    <div ref={popupRef}>
                                                        <div className="flex flex-col">
                                                            <div className="flex justify-end">
                                                                <CloseBtn onClick={setAllToFalse} />
                                                            </div>
                                                            <h1 className="m-2 self-center">To which day do you want to move this event?</h1>
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
                                                                <input onMouseDown={(e) => e.stopPropagation()} onClick={handleMove} className="btn btn-sm mt-4 w-28 btn-success text-white" value={"Move Event"} />
                                                                <input className="btn btn-sm mt-4 w-24 btn-error text-white" value={"Cancel"} onClick={setAllToFalse} />
                                                            </div>
                                                            {isIncompleteInput &&
                                                                <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a day</p>}
                                                        </div>
                                                    </div>
                                                }
                                            </Popup>
                                        </li>}
                                    <li>
                                        <Popup
                                            open={isMoveAnotherModule}
                                            onOpen={() => setIsMoveAnotherModule(true)}
                                            onClose={setAllToFalse}
                                            trigger={<button
                                                type="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Move Event to another Module
                                            </button>}
                                            modal
                                        >
                                            {
                                                <div ref={popupRefAnotherModule}>
                                                    <div className="flex flex-col">
                                                        <div className="flex justify-end">
                                                            <CloseBtn onClick={setAllToFalse} />
                                                        </div>
                                                        <h1 className="m-2 self-center">To which module do you want to move this event?</h1>
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
                                                                <h1 className="m-2 self-center">To which day of this module do you want to move this event?</h1>
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
                                                                <h1 className="mt-4 self-center font-bold">Moving this event will save all changes!</h1>
                                                                <h1 className="mt-4 self-center font-bold">If this module is part of a course, the course will also be modified!</h1>
                                                            </>
                                                        }
                                                        <div className="flex items-center justify-center mb-4 gap-2">
                                                            <input onMouseDown={(e) => e.stopPropagation()} onClick={handleMoveAnotherModule} className="btn btn-sm mt-4 w-44 btn-success text-white" value={"Move Event and Save"} />
                                                            <input className="btn btn-sm mt-4 w-24 btn-error text-white" value={"Cancel"} onClick={setAllToFalse} />
                                                        </div>
                                                        {isIncompleteInput &&
                                                            <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a module and a day</p>}
                                                    </div>
                                                </div>
                                            }
                                        </Popup>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                }
            </td>
        </tr>

    )
}