import InputSmall from '../../../components/inputFields/InputSmall';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import TrashBtn from '../../../components/buttons/TrashBtn';
import { DayProps } from '../Types';
import CalendarEvent from './CalendarEvent';
import { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import CloseBtn from '../../../components/buttons/CloseBtn';

export default function Day({ moduleIndex, day, setDays, days, setNumOfDays }: DayProps) {
    const handleAddEvent = () => {
        const editedDays = [...days];
        editedDays[day.dayNumber - 1].events.push({
            name: "",
            startTime: "",
            endTime: ""
        });
        setDays(editedDays);
    }

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
        for (var i = index; i < editedDays.length; i++) {
            editedDays[i].dayNumber = i + 1;
        }
        setDays(editedDays);
    }

    const handleDeleteDay = (index: number) => {
        setNumOfDays(days.length - 1);
        const editedDays = [...days];
        editedDays.splice(index, 1);
        for (var i = index; i < editedDays.length; i++) {
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

    const [_isMove, setIsMove] = useState<boolean>(false);

    const popupRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsMove(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [showOptions, setShowOptions] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
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
        // if (buttonRef.current) {
        //     const buttonRect = buttonRef.current.getBoundingClientRect();
        //     setPopupPosition({
        //         top: buttonRect.bottom,
        //         left: buttonRect.left
        //     });
        // }
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

    const handleMove = () => {
        console.log('Day moes to another Module');
        // Add your move logic here
    };

    return (
        <>
            <div className="relative">
                {day.events.length > 0
                    ? <div className="collapse">
                        <input type="checkbox" id={`collapse-toggle-events-${moduleIndex}-${day.dayNumber}`} className="hidden" />
                        <div className="collapse-title text-base w-100 flex flex-row">
                            <div className='flex flex-row w-2/12'>
                                {day.dayNumber == 1 &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center" onClick={() => moveDown(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber == days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center" onClick={() => moveUp(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber != 1 && day.dayNumber != days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center" onClick={() => moveUp(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                        <button type="button" className="w-full h-full self-center" onClick={() => moveDown(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
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
                                <TrashBtn handleDelete={() => handleDeleteDay(day.dayNumber - 1)} />
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
                                                                        <CloseBtn onClick={() => setIsMove(false)} />
                                                                    </div>
                                                                    <h1 className="m-2">You want to move this day to another module.</h1>
                                                                    <h1 className="font-bold m-2">Do you want to continue?</h1>
                                                                    <div className="flex items-center justify-center mb-4 gap-2">
                                                                        <input onClick={handleMove} className="btn btn-sm mt-4 w-24 btn-success text-white" value={"Yes"} />
                                                                        <input className="btn btn-sm mt-4 w-24 btn-error text-white" value={"No"} onClick={() => setIsMove(false)} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </Popup>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <label htmlFor={`collapse-toggle-events-${moduleIndex}-${day.dayNumber}`} className="w-1/12 cursor-pointer flex flex-row items-center justify-end">
                                <h6 className='text-xs ml-2'>Events</h6>
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
                                {day.dayNumber == 1 &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center" onClick={() => moveDown(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber == days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center" onClick={() => moveUp(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                    </div>
                                }
                                {day.dayNumber != 1 && day.dayNumber != days.length &&
                                    <div className="flex flex-col w-[26px] mr-2">
                                        <button type="button" className="w-full h-full self-center" onClick={() => moveUp(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                        <button type="button" className="w-full h-full self-center" onClick={() => moveDown(day.dayNumber - 1)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
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
                                <TrashBtn handleDelete={() => handleDeleteDay(day.dayNumber - 1)} />
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
                                                    <button
                                                        type="button"
                                                        onClick={handleMove}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Move Day to another Module
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h6 className='w-1/12 text-xs'></h6>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}
