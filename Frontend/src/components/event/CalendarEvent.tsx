import DeleteBtn from "../buttons/DeleteBtn";
import InputSmall from "../inputFields/InputSmall";
import InputSmallTime from "../inputFields/InputSmallTime";
import { EventProps } from "./Types"

export default function CalendarEvent({ dayNumber, setDays, days, index, event }: EventProps) {


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const editedDays = [...days];
        editedDays[dayNumber - 1].events[index] = {
            ...editedDays[dayNumber - 1].events[index],
            [name]: value
        }

        setDays(editedDays);
    }

    const handleDeleteEvent = () => {
        const editedDays = [...days];
        editedDays[dayNumber - 1].events.splice(index, 1);
        setDays(editedDays);
    }

    var startTimeDefault = event.startTime.replace(".",":") + ":00";
    if (startTimeDefault.length == 7)
        startTimeDefault = "0" + startTimeDefault;
    var endTimeDefault = event.endTime.replace(".",":") + ":00";
    if (endTimeDefault.length == 7)
        endTimeDefault = "0" + endTimeDefault;

    return (
        <tr className="gap-2">
            <td><InputSmall onChange={handleInputChange} name="name" value={event.name} type="text" placeholder="Event name" /></td>
            <td><InputSmall onChange={handleInputChange} name="description" value={event.description} type="text" placeholder="Description" /></td>
            <td><InputSmallTime onChange={handleInputChange} name="startTime" value={startTimeDefault} type="time" /></td>
            <td><InputSmallTime onChange={handleInputChange} name="endTime" value={endTimeDefault} type="time" /></td>
            <td className="text-end">
                    <DeleteBtn handleDelete={handleDeleteEvent} />
            </td>
        </tr>

    )
}