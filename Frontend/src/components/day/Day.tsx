import { useState } from 'react';
import Event from '../event/Event'
import { DayProps} from './Types'


export default function Day({dayNumber}: DayProps) {
    const [numOfEvents, setNumOfEvents] = useState<number>(1);
    const [events, setEvents] = useState<number[]>([]);

    const handleAddEvent = () => {
        setNumOfEvents(numOfEvents + 1);
        setEvents([...Array(numOfEvents).keys()].map(i => i + 1));
    }

    return (
        <table className="table table-sm">
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
                {events.map((i) => <Event key={i}/>)}
            </tbody>
        </table>
    )
}