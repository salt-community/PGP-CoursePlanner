import { DayProps } from './Types'
import CalendarEvent from '../event/CalendarEvent';
import PrimaryBtn from '../buttons/PrimaryBtn';
import InputSmall from '../inputFields/InputSmall';
import { useState } from 'react';
import DeleteBtn from '../buttons/DeleteBtn';


export default function Day({ day, setDays, days, setNumOfDays }: DayProps) {
    const handleAddEvent = () => {
        const editedDays = [...days];

        editedDays[day.dayNumber - 1].events.push({
            name: "",
            startTime: "",
            endTime: ""
        })

        setDays(editedDays)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const editedDays = [...days];
        editedDays[day.dayNumber - 1].description = e.target.value
        setDays(editedDays);
    }

    const handleDeleteDay = (index: number) => {
        setNumOfDays(days.length - 1)
        const editedDays = [...days];
        editedDays.splice(index, 1);
        for (var i=index; i<editedDays.length; i++) {
            editedDays[i].dayNumber = i+1;
            //editedDays[i].description = days[i+1].description;
            //editedDays[i].events = days[i+1].events;
        }
        setDays(editedDays);
    }

    return (
        <>
            <div className="w-auto space-x-2 flex flex-row justify-between">
                <h2 className="flex items-center min-w-14 align-bottom">Day {day.dayNumber}</h2>
                <div className="flex w-[800px]">
                    <InputSmall onChange={handleInputChange} type="text" placeholder="Theme" name="description" value={day.description} />
                </div>
                    <PrimaryBtn onClick={handleAddEvent}> + Add Event</PrimaryBtn>
                    <DeleteBtn handleDelete={() => handleDeleteDay(day.dayNumber - 1)} />
            </div>
            <div>
                {day.events.length > 0
                    ?
                    <table className="table table-sm table-fixed">
                        <thead>
                            <tr>
                                <th className="w-3/12">Name</th>
                                <th className="w-4/12">Description</th>
                                <th className="w-1/6">Start</th>
                                <th className="w-1/6">End</th>
                                <th className="w-1/12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {day.events.map((event, index) => <CalendarEvent event={event} key={index} days={days} setDays={setDays} index={index} dayNumber={day.dayNumber} />)}
                        </tbody>
                    </table>
                    : <></>
                }
            </div>
        </>
    )
}