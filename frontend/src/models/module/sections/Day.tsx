import InputSmall from '@components/inputFields/InputSmall';
import PrimaryBtn from '@components/buttons/PrimaryBtn';
import TrashBtn from '@components/buttons/TrashBtn';
import { useState } from 'react';
import DownArrowBtn from '../../../components/buttons/DownArrowBtn';
import UpArrowBtn from '../../../components/buttons/UpArrowBtn';
import EditEventTable from '../../../components/EditEventTable';
import { useQueryModules } from '@api/module/moduleQueries';
import MoveDayDropdown from './MoveDayDropdown';
import { DayProps } from '@api/Types';

export default function Day({ editTrue, moduleId, day, setDays, days, setNumOfDays }: DayProps) {
    const [selectedModule, setSelectedModule] = useState<string>("DEFAULT");
    const [selectedModuleDay, setSelectedModuleDay] = useState<string>("DEFAULT");
    const { data: modules } = useQueryModules();

    const handleAddEvent = () => {
        const editedDays = [...days];
        editedDays[day.dayNumber - 1].events.push({
            name: "",
            startTime: "",
            endTime: ""

        })
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
            events: [],
            date: new Date(),
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

    const handleSelectModule = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModule(event.target.value);
        setSelectedModuleDay("DEFAULT");
    };

    const handleSelectModuleDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModuleDay(event.target.value);
    };



    const renderMoveButtons = (dayNumber: number, daysLength: number) => {
        if (dayNumber === 1 && dayNumber !== daysLength) {
            return <DownArrowBtn onClick={() => moveDown(dayNumber - 1)} color={"base-content"} />;
        }
        if (dayNumber !== 1 && dayNumber === daysLength) {
            return <UpArrowBtn onClick={() => moveUp(dayNumber - 1)} color={"base-content"} />;
        }
        if (dayNumber !== 1 && dayNumber !== daysLength) {
            return (
                <>
                    <UpArrowBtn onClick={() => moveUp(dayNumber - 1)} color={"base-content"} />
                    <DownArrowBtn onClick={() => moveDown(dayNumber - 1)} color={"base-content"} />
                </>
            );
        }
        return null;
    };

    return (
        <div className="relative">
            <div className="collapse overflow-visible">
                <input type="checkbox" id={`collapse-toggle-events-${moduleId}-${day.dayNumber}`} className="hidden" />
                <div className="collapse-title text-base w-100 flex flex-row">
                    <div className='flex flex-row w-2/12'>
                        <div className="flex flex-col w-[26px] mr-2">
                            {renderMoveButtons(day.dayNumber, days.length)}
                        </div>
                        <h2 className="self-center font-bold">Day {day.dayNumber}</h2>
                    </div>
                    <div className="flex w-4/12 xl:w-5/12 self-center">
                        <InputSmall
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Theme"
                            name="description"
                            value={day.description}
                        />
                    </div>
                    <div className="w-2/12 flex justify-center self-center">
                        <PrimaryBtn onClick={handleAddEvent}>+ Event</PrimaryBtn>
                    </div>
                    <div className="w-3/12 xl:w-2/12 flex justify-start gap-1 self-center">
                        <PrimaryBtn onClick={() => handleAddDays(day.dayNumber - 1)}>+</PrimaryBtn>
                        {days.length > 1 && (
                            <>
                                <TrashBtn handleDelete={() => handleDeleteDay(day.dayNumber - 1)} />
                                <MoveDayDropdown
                                    editTrue={editTrue}
                                    dayNumber={day.dayNumber}
                                    modules={modules}
                                    moduleId={moduleId}
                                    selectedModule={selectedModule}
                                    selectedModuleDay={selectedModuleDay}
                                    handleSelectModule={handleSelectModule} 
                                    handleSelectModuleDay={handleSelectModuleDay} 
                                    setSelectedModule={setSelectedModule}
                                    setSelectedModuleDay={setSelectedModuleDay}
                                    setNumOfDays={setNumOfDays}
                                    setDays={setDays}
                                    day={day}
                                    days={days}
                                />
                            </>
                        )}
                    </div>
                    <label htmlFor={`collapse-toggle-events-${moduleId}-${day.dayNumber}`} className="w-1/12 cursor-pointer flex flex-row items-center justify-end">
                        <h6 className='text-xs ml-2 hover:italic'>Events</h6>
                        <svg className="fill-current w-4 h-4 transform rotate-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M15.3 9.3l-3.3 3.3-3.3-3.3-1.4 1.4 4.7 4.7 4.7-4.7z" />
                        </svg>
                    </label>
                </div>
                {day.events.length > 0 && (
                    <div className="collapse-content">
                        <EditEventTable
                            moduleId={moduleId}
                            editTrue={editTrue}
                            day={day}
                            setDays={setDays}
                            days={days}
                            appliedTrue={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}