    import { DayProps } from './Types'
import CalendarEvent from '../event/CalendarEvent';


export default function Day({ dayNumber, events, setDays, days }: DayProps) {

    const handleAddEvent = () => {
        const editedDays = [...days];

        editedDays[dayNumber-1].events.push({
            name: "",
            startTime: "",
            endTime: ""
        })

        setDays(editedDays)
    }

    return (
        <>
            <table className="table table-sm">
                {events.length > 0 ?
                    <>
                        <thead>
                            <tr>
                                <th>Day {dayNumber}</th>
                                <th><input className="input input-bordered input-sm max-w-xs" type="text" placeholder="Theme" /></th>
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
                            {events.map((event, index) => <CalendarEvent event={event} key={index} days={days} setDays={setDays} index={index} dayNumber={dayNumber} />)}
                        </tbody>
                    </>
                    :
                    <thead>
                        <tr>
                            <th>Day {dayNumber}</th>
                            <th><input className="input input-bordered input-sm max-w-xs" type="text" placeholder="Theme" /></th>
                            <th><div className="w-96"></div></th>
                            <th><button type="button" onClick={handleAddEvent} className="btn btn-sm btn-primary"> + Add Event</button></th>
                        </tr>

                    </thead>
                }
            </table>
        </>
    )
}