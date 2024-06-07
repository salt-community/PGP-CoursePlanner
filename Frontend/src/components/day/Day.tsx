import { useState } from 'react';
import Event from '../event/Event'
import { DayProps } from './Types'


export default function Day({ dayNumber }: DayProps) {
    const [numOfEvents, setNumOfEvents] = useState<number>(1);
    const [events, setEvents] = useState<number[]>([]);

    const handleAddEvent = () => {
        setNumOfEvents(numOfEvents + 1);
        setEvents([...Array(numOfEvents).keys()].map(i => i + 1));
    }

    return (
        <>
            <table className="table table-sm">
                {events.length > 0 ?
                    <>
                        <thead>
                            <tr>
                                <th>Day {dayNumber}</th>
                                <th> </th>
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
                            {events.map((number, index) => <Event key={number} eventArr={events} setEventArr={setEvents} index={index} />)}
                        </tbody>
                    </>
                    :
                    <thead>
                        <tr>
                            <th>Day {dayNumber}</th>
                            <th><div className="w-72"></div></th>
                            <th><div className="w-64"></div></th>
                            <th><button type="button" onClick={handleAddEvent} className="btn btn-sm btn-primary"> + Add Event</button></th>
                        </tr>

                    </thead>
                }
            </table>
        </>
    )
}