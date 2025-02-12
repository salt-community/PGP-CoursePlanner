import { EventType } from "@models/course/Types";

type Props = {
    events: EventType[];
}

export default function DayTable({ events }: Props) {

    return (
        <table className="table table-sm table-zebra border rounded-lg overflow-auto">
            <thead>
                <tr>
                    <th>Event Names</th>
                    <th>Description</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {events.map((event, eventIndex) =>
                    <tr key={eventIndex}>
                        <td>{event.name}</td>
                        <td>{event.description}</td>
                        <td>{`${event.startTime} - ${event.endTime}`}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )

}