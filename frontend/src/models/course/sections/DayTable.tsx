import { EventType } from "@models/module/Types";

type Props = {
    events: EventType[];
}

export default function DayTable({ events }: Props) {

    return (
        <div className="overflow-x-auto overflow-scroll">
            <table className="table table-sm table-zebra">
                {/* head */}
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
        </div>
    )

}