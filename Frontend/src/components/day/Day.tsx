import { DayProps } from './Types'
import CalendarEvent from '../event/CalendarEvent';
import PrimaryBtn from '../buttons/PrimaryBtn';
import InputSmall from '../inputFields/InputSmall';
import { useState } from 'react';


export default function Day({ day, setDays, days }: DayProps) {
    const [dayTheme, setDayTheme] = useState<string>(day.description)

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
        setDayTheme(e.target.value);
        const editedDays = [...days];
        editedDays[day.dayNumber - 1].description = e.target.value
        setDays(editedDays);
    }


    return (
        <>
            <table className="table table-sm">
                {day.events.length > 0 ?
                    <>
                        <thead>
                            <tr>
                                <th>Day {day.dayNumber}</th>
                                <th><InputSmall onChange={handleInputChange} type="text" placeholder="Theme" name="description" value={dayTheme} /></th>
                                <th> </th>
                                <th> </th>
                                <th><button type="button" onClick={handleAddEvent} className="btn btn-sm btn-primary"> + Add Event</button></th>
                            </tr>

                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Start</th>
                                <th>End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {day.events.map((event, index) => <CalendarEvent event={event} key={index} days={days} setDays={setDays} index={index} dayNumber={day.dayNumber} />)}
                        </tbody>
                    </>
                    :
                    <thead>
                        <tr>
                            <th>Day {day.dayNumber}</th>
                            <th><InputSmall onChange={handleInputChange} type="text" placeholder="Theme" name="description" value={dayTheme} /></th>
                            <th><div className="w-96"></div></th>
                            <th><PrimaryBtn onClick={handleAddEvent}> + Add Event</PrimaryBtn></th>
                        </tr>

                    </thead>
                }
            </table>
        </>
    )
}