import CalendarEvent from "../models/module/sections/CalendarEvent"
import { DayType } from "../models/module/Types"

type Props = {
    editTrue: boolean
    moduleId: number
    day: DayType
    setDays: React.Dispatch<React.SetStateAction<DayType[]>>
    days: DayType[]
    appliedTrue: boolean
}

export default function EventTable({day, moduleId, editTrue, days, setDays, appliedTrue}: Props) {
    return (
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
                        appliedTrue={appliedTrue}
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
    )
}