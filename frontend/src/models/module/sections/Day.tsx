import InputSmall from '../../../components/inputFields/InputSmall';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import TrashBtn from '../../../components/buttons/TrashBtn';
import { DayProps, ModuleType } from '../Types';
import CalendarEvent from './CalendarEvent';
import { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import CloseBtn from '../../../components/buttons/CloseBtn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { editModule, getAllModules } from '../../../api/ModuleApi';

export default function Day({ editTrue, moduleId, day, setDays, days, setNumOfDays }: DayProps) {
    const [isMove, setIsMove] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const [selectedModule, setSelectedModule] = useState<string>("DEFAULT");
    const [selectedModuleDay, setSelectedModuleDay] = useState<string>("DEFAULT");
    const popupRef = useRef<HTMLDivElement>(null);
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    const handleAddEvent = () => {
        const editedDays = [...days];
        editedDays[day.dayNumber - 1].events.push({
            name: "",
            startTime: "",
            endTime: ""
        });
        setDays(editedDays);
    }

    // changes day description
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const editedDays = [...days];
        editedDays[day.dayNumber - 1].description = e.target.value;
        setDays(editedDays);
    }

    const handleAddDays = (index: number) => {
        setNumOfDays(days.length + 1);
        const emptyDay = {
            dayNumber: index + 2,
            description: "",
            events: []
        };
        const editedDays = [...days];
        editedDays.splice(index + 1, 0, emptyDay);
        for (let i = index; i < editedDays.length; i++) {
            editedDays[i].dayNumber = i + 1;
        }
        setDays(editedDays);
    }

    const handleDeleteDay = (index: number) => {
        setNumOfDays(days.length - 1);
        const editedDays = [...days];
        editedDays.splice(index, 1);
        for (let i = index; i < editedDays.length; i++) {
            editedDays[i].dayNumber = i + 1;
        }
        setDays(editedDays);
    }

    const moveDown = (index: number) => {
        const editedDays = [...days];

        const temp = editedDays[index];
        editedDays[index] = editedDays[index + 1];
        editedDays[index].dayNumber = index + 1;
        editedDays[index + 1] = temp;
        editedDays[index + 1].dayNumber = index + 2;

        setDays(editedDays);
    }

    const moveUp = (index: number) => {
        const editedDays = [...days];

        const temp = editedDays[index];
        editedDays[index] = editedDays[index - 1];
        editedDays[index].dayNumber = index + 1;
        editedDays[index - 1] = temp;
        editedDays[index - 1].dayNumber = index;

        setDays(editedDays);
    }

    // handle clicking on three dots button
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

    // handle clicking outside popup moveDay
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setAllToFalse()
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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
            setAllToFalse()
            const form = document.getElementById('editCourse-form') as HTMLFormElement;

            if (form) {
                const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(syntheticEvent);
            }
        }
    })

    const handleMove = () => {
        setIsIncompleteInput(false);
        if (selectedModule != "DEFAULT" && selectedModuleDay != "DEFAULT") {
            const editedDaysCurrent = [...days];
            editedDaysCurrent.splice(day.dayNumber - 1, 1);
            for (let i = day.dayNumber - 1; i < editedDaysCurrent.length; i++) {
                editedDaysCurrent[i].dayNumber = i + 1;
            }
            setNumOfDays(days.length - 1);
            setDays(editedDaysCurrent);

            const originalDays = modules?.find(m => m.id == parseInt(selectedModule))!.days!;
            const editedDays = [...originalDays];
            editedDays.splice(parseInt(selectedModuleDay) - 1, 0, day);
            for (let i = parseInt(selectedModuleDay) - 1; i < editedDays.length; i++) {
                editedDays[i].dayNumber = i + 1;
            }

            const module = modules?.find(m => m.id == parseInt(selectedModule))!;
            const newModule: ModuleType = {
                id: module.id,
                name: module.name,
                numberOfDays: module.numberOfDays + 1,
                days: editedDays
            };
            mutation.mutate(newModule);
        }
        else {
            setIsIncompleteInput(true);
        }
    };

    const setAllToFalse = () => {
        setIsMove(false);
        setIsIncompleteInput(false);
        setSelectedModule("DEFAULT");
        setSelectedModuleDay("DEFAULT");
    }
    return (
        <>
            <div className="relative">
                {day.events.length > 0
                    ? <div className="collapse">
                        <input type="checkbox" id={`collapse-toggle-events-${moduleId}-${day.dayNumber}`} className="hidden" />
                        <div className="collapse-title text-base w-100 flex flex-row">
                            <div className='flex flex-row w-2/12'>
                                {day.dayNumber == 1 && day.dayNumber != days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveDown(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber != 1 && day.dayNumber == days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveUp(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber != 1 && day.dayNumber != days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveUp(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                        <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveDown(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber == 1 && day.dayNumber == days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                    </div>
                                }
                                <h2 className="self-center font-bold">Day {day.dayNumber}</h2>
                            </div>
                            <div className="flex w-4/12 xl:w-5/12 self-center">
                                <InputSmall onChange={handleInputChange} type="text" placeholder="Theme" name="description" value={day.description} />
                            </div>
                            <div className="w-2/12 flex justify-center self-center">
                                <PrimaryBtn onClick={handleAddEvent}> + Event</PrimaryBtn>
                            </div>
                            <div className="w-3/12 xl:w-2/12 flex justify-start gap-1 self-center">
                                <PrimaryBtn onClick={() => handleAddDays(day.dayNumber - 1)}>+</PrimaryBtn>
                                {days.length > 1 &&
                                    <>
                                        <TrashBtn handleDelete={() => handleDeleteDay(day.dayNumber - 1)} />
                                        {editTrue &&
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
                                                        className="fixed w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50"
                                                        style={{
                                                            top: popupPosition.top,
                                                            left: popupPosition.left
                                                        }}
                                                    >
                                                        <ul className="py-1">
                                                            <li>
                                                                <Popup
                                                                    open={isMove}
                                                                    onOpen={() => setIsMove(true)}
                                                                    onClose={setAllToFalse}
                                                                    trigger={<button
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    >
                                                                        Move Day to another Module
                                                                    </button>}
                                                                    modal
                                                                >
                                                                    {
                                                                        <div ref={popupRef}>
                                                                            <div className="flex flex-col">
                                                                                <div className="flex justify-end">
                                                                                    <CloseBtn onClick={setAllToFalse} />
                                                                                </div>
                                                                                <h1 className="m-2 self-center">To which module do you want to move this event?</h1>
                                                                                <div className="flex flex-col self-center">
                                                                                <select
                                                                                    onMouseDown={(e) => e.stopPropagation()}
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                    onChange={handleSelectModule}
                                                                                    className="border border-gray-300 rounded-lg p-1 w-fit"
                                                                                    defaultValue="DEFAULT"
                                                                                >
                                                                                    <option key={moduleId + ",default"} value="DEFAULT" disabled>
                                                                                    Select Module
                                                                                    </option>
                                                                                    {modules && modules.map((module, moduleIndex) => (
                                                                                    module.id !== moduleId && (
                                                                                        <option key={`${module.id}:${moduleIndex}`} value={module.id}>
                                                                                        {module.name}
                                                                                        </option>
                                                                                    )
                                                                                    ))}
                                                                                </select>
                                                                                </div>

                                                                                {selectedModule != "DEFAULT" &&
                                                                                    <div className="flex flex-col items-center">
                                                                                        <h1 className="m-2 self-center">To which day of this module do you want to move this event?</h1>
                                                                                        <div className="flex flex-col self-center">
                                                                                            <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModuleDay} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                                                                                <option key={moduleId + ",defaultDay"} value="DEFAULT" disabled>Select Day</option>
                                                                                                {modules && modules.find(m => m.id == parseInt(selectedModule))!.days.map((day, dayIndex) =>
                                                                                                    <option key={day.id + "," + dayIndex} value={day.dayNumber}>Day {day.dayNumber}</option>
                                                                                                )}
                                                                                                <option key={day.id + "," + modules!.find(m => m.id == parseInt(selectedModule))!.days.length} value={modules!.find(m => m.id == parseInt(selectedModule))!.days.length + 1}>Day {modules!.find(m => m.id == parseInt(selectedModule))!.days.length + 1}</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>}
                                                                                {selectedModule != "DEFAULT" && selectedModuleDay != "DEFAULT" &&
                                                                                    <>
                                                                                        <h1 className="mt-4 self-center font-bold">Moving this day will save all changes!</h1>
                                                                                        <h1 className="mt-4 self-center font-bold">If this module is part of a course, the course will also be modified!</h1>
                                                                                    </>
                                                                                }
                                                                                <div className="flex items-center justify-center mb-4 gap-2">
                                                                                    <input onMouseDown={(e) => e.stopPropagation()} onClick={handleMove} className="btn btn-sm mt-4 w-40 btn-success text-white" value={"Move Day and Save"} />
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
                                    </>
                                }
                            </div>
                            <label htmlFor={`collapse-toggle-events-${moduleId}-${day.dayNumber}`} className="w-1/12 cursor-pointer flex flex-row items-center justify-end">
                                <h6 className='text-xs ml-2 hover:italic'>Events</h6>
                                <svg className="fill-current w-4 h-4 transform rotate-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M15.3 9.3l-3.3 3.3-3.3-3.3-1.4 1.4 4.7 4.7 4.7-4.7z" />
                                </svg>
                            </label>
                        </div>
                        <div className="collapse-content">
                            <table className="table table-sm table-fixed">
                                <thead>
                                    <tr>
                                        <th className="w-2/12">Event name</th>
                                        <th className="w-4/12">Description</th>
                                        <th className="w-1/6">Start</th>
                                        <th className="w-1/6">End</th>
                                        <th className="w-1/12"></th>
                                        <th className="w-1/12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.events.map((event, index) => (
                                        <CalendarEvent
                                            moduleId={moduleId}
                                            editTrue={editTrue}
                                            appliedTrue={false}
                                            event={event}
                                            key={index}
                                            days={days}
                                            setDays={setDays}
                                            index={index}
                                            dayNumber={day.dayNumber}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    : <div className="collapse">
                        <input type="checkbox" id={`collapse-toggle-events-${day.dayNumber}`} className="hidden" />
                        <div className="collapse-title text-base w-100 flex flex-row">
                            <div className='flex flex-row w-2/12'>
                                {day.dayNumber == 1 && day.dayNumber != days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveDown(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber != 1 && day.dayNumber == days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveUp(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber != 1 && day.dayNumber != days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveUp(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                        <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveDown(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber == 1 && day.dayNumber == days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                    </div>
                                }
                                <h2 className="self-center font-bold">Day {day.dayNumber}</h2>
                            </div>
                            <div className="flex w-4/12 xl:w-5/12 self-center">
                                <InputSmall onChange={handleInputChange} type="text" placeholder="Theme" name="description" value={day.description} />
                            </div>
                            <div className="w-2/12 flex justify-center self-center">
                                <PrimaryBtn onClick={handleAddEvent}> + Event</PrimaryBtn>
                            </div>
                            <div className="w-3/12 xl:w-2/12 flex justify-start gap-1 self-center">
                                <PrimaryBtn onClick={() => handleAddDays(day.dayNumber - 1)}>+</PrimaryBtn>
                                {days.length > 1 &&
                                    <>
                                        <TrashBtn handleDelete={() => handleDeleteDay(day.dayNumber - 1)} />
                                        {editTrue &&
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
                                                        className="fixed w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50"
                                                        style={{
                                                            top: popupPosition.top,
                                                            left: popupPosition.left
                                                        }}
                                                    >
                                                        <ul className="py-1">
                                                            <li>
                                                                <Popup
                                                                    onOpen={() => setIsMove(true)}
                                                                    onClose={setAllToFalse}
                                                                    trigger={<button
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    >
                                                                        Move Day to another Module
                                                                    </button>}
                                                                    modal
                                                                >
                                                                    {
                                                                        <div ref={popupRef}>
                                                                            <div className="flex flex-col">
                                                                                <div className="flex justify-end">
                                                                                    <CloseBtn onClick={setAllToFalse} />
                                                                                </div>
                                                                                <h1 className="m-2 self-center">To which module do you want to move this event?</h1>
                                                                                <div className="flex flex-col self-center">
                                                                                    <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModule} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                                                                        <option key={moduleId + ",default"} value="DEFAULT" disabled>Select Module</option>
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
                                                                                                <option key={moduleId + ",defaultDay"} value="DEFAULT" disabled>Select Day</option>
                                                                                                {modules && modules.find(m => m.id == parseInt(selectedModule))!.days.map((day, dayIndex) =>
                                                                                                    <option key={day.id + "," + dayIndex} value={day.dayNumber}>Day {day.dayNumber}</option>
                                                                                                )}
                                                                                                <option key={day.id + "," + modules!.find(m => m.id == parseInt(selectedModule))!.days.length} value={modules!.find(m => m.id == parseInt(selectedModule))!.days.length + 1}>Day {modules!.find(m => m.id == parseInt(selectedModule))!.days.length + 1}</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>}
                                                                                {selectedModule != "DEFAULT" && selectedModuleDay != "DEFAULT" &&
                                                                                    <h1 className="m-2 self-center font-bold">Moving this day will save all changes!</h1>
                                                                                }
                                                                                <div className="flex items-center justify-center mb-4 gap-2">
                                                                                    <input onMouseDown={(e) => e.stopPropagation()} onClick={handleMove} className="btn btn-sm mt-4 w-40 btn-success text-white" value={"Move Day and Save"} />
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
                                    </>
                                }
                            </div>
                            <h6 className='w-1/12 text-xs'></h6>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}
