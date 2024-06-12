import { EventProps } from "./Types"

export default function CalendarEvent({ dayNumber, setDays, days, index, event}: EventProps) {


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const editedDays = [...days];
        editedDays[dayNumber-1].events[index] = {
            ...editedDays[dayNumber-1].events[index],
            [name]: value
        }

        setDays(editedDays);
    }

    const handleDeleteEvent = () => {
        const editedDays = [...days];
        console.log("removing event ", editedDays[dayNumber-1].events[index]);
        editedDays[dayNumber-1].events.splice(index, 1);
        setDays(editedDays);
    }

    return (
        <tr className="">
            <td><input onChange={handleInputChange} name="name" value={event.name} type="text" placeholder="Event name" className="input input-bordered w-full input-sm max-w-xs " /> </td>
            <td><input onChange={handleInputChange} name="description" value={event.description} type="text" placeholder="Description" className="input input-bordered w-full input-sm max-w-xs " /></td>
            <td><input onChange={handleInputChange} name="startTime" value={event.startTime} type="time" className="input input-bordered w-full input-sm max-w-xs " /></td>
            <td><input onChange={handleInputChange} name="endTime" value={event.endTime} type="time" className="input input-bordered w-full input-sm max-w-xs " /></td>
            <td>
                <svg onClick={handleDeleteEvent} className="btn btn-sm btn-error py-1 max-w-xs" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </td>
        </tr>

    )
}