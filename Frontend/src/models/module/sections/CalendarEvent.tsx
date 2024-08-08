import { useEffect, useRef, useState } from "react";
import TrashBtn from "../../../components/buttons/TrashBtn";
import InputSmall from "../../../components/inputFields/InputSmall";
import InputSmallTime from "../../../components/inputFields/InputSmallTime";
import { EventProps } from "../Types";

export default function CalendarEvent({appliedTrue, dayNumber, setDays, days, index, event }: EventProps) {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const editedDays = [...days];
        editedDays[dayNumber - 1].events[index] = {
            ...editedDays[dayNumber - 1].events[index],
            [name]: value
        }

        setDays(editedDays);
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const editedDays = [...days];

        let correctTime = value.replaceAll(".", ":");
        console.log(correctTime)
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

    var startTimeDefault = event.startTime + ":00";
    if (startTimeDefault.length == 7)
        startTimeDefault = "0" + startTimeDefault;

    var endTimeDefault = event.endTime + ":00";
    if (endTimeDefault.length == 7)
        endTimeDefault = "0" + endTimeDefault;

    const [showOptions, setShowOptions] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            setPopupPosition({
                top: buttonRect.bottom + window.scrollY,
                left: buttonRect.left + window.scrollX
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

    useEffect(() => {
        if (showOptions) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showOptions]);

    const handleMove = () => {
        console.log('Event moves to another Day');
        // Add your delete logic here
    };

    const handleMoveAnotherModule = () => {
        console.log('Event moves to another Module');
        // Add your move logic here
    };

    return (
        <tr className="gap-2">
            <td><input onChange={handleInputChange} name="name" value={event.name} type="text" placeholder="Event name" className="input input-bordered w-full min-w-[120px] input-sm" /></td>
            <td><InputSmall onChange={handleInputChange} name="description" value={event.description} type="text" placeholder="Description" /></td>
            <td><InputSmallTime onChange={handleTimeChange} name="startTime" value={startTimeDefault} type="time" /></td>
            <td><InputSmallTime onChange={handleTimeChange} name="endTime" value={endTimeDefault} type="time" /></td>
            <td className="text-end flex gap-1">
                <TrashBtn handleDelete={handleDeleteEvent} />
                {!appliedTrue &&
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
                                <li>
                                    <button
                                        type="button"
                                        onClick={handleMove}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                        Move Event to another Day
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={handleMoveAnotherModule}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                        Move Event to another Module
                                    </button>
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