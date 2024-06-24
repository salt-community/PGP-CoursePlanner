import DeleteBtn from "../buttons/DeleteBtn";
import InputSmall from "../inputFields/InputSmall";
import { EventProps } from "./Types"

export default function CalendarEvent({ dayNumber, setDays, days, index, event}: EventProps) {


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const editedDays = [...days];
        editedDays[dayNumber -1].events[index] = {
            ...editedDays[dayNumber -1].events[index],
            [name]: value
        }

        setDays(editedDays);
    }

    const handleDeleteEvent = () => {
        const editedDays = [...days];
        editedDays[dayNumber-1].events.splice(index, 1);
        setDays(editedDays);
    }

    return (
        <tr className="">
            <td><InputSmall onChange={handleInputChange} name="name" value={event.name} type="text" placeholder="Event name"/></td>
            <td><InputSmall onChange={handleInputChange} name="description" value={event.description} type="text" placeholder="Description"/></td>
            <td><InputSmall onChange={handleInputChange} name="startTime" value={event.startTime} type="time"/></td>
            <td><InputSmall onChange={handleInputChange} name="endTime" value={event.endTime} type="time"/></td>
            <td>
                <DeleteBtn handleDelete={handleDeleteEvent}/>
            </td>
        </tr>

    )
}