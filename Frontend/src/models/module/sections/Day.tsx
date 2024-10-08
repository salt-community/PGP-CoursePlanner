import InputSmall from '../../../components/inputFields/InputSmall';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import TrashBtn from '../../../components/buttons/TrashBtn';
import { DayProps } from '../Types';
import CalendarEvent from './CalendarEvent';


export default function Day({ day, setDays, days, setNumOfDays }: DayProps) {
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
        const editedDays = [...days];
        editedDays[day.dayNumber - 1].description = e.target.value
        setDays(editedDays);
    }

    const handleAddDays = (index: number) => {
        setNumOfDays(days.length + 1)
        const emptyDay = {
            dayNumber: index + 2,
            description: "",
            events: []
        };
        const editedDays = [...days];
        editedDays.splice(index + 1, 0, emptyDay);
        for (var i = index; i < editedDays.length; i++) {
            editedDays[i].dayNumber = i + 1;
        }
        setDays(editedDays);
    }

    const handleDeleteDay = (index: number) => {
        setNumOfDays(days.length - 1)
        const editedDays = [...days];
        editedDays.splice(index, 1);
        for (var i = index; i < editedDays.length; i++) {
            editedDays[i].dayNumber = i + 1;
        }
        setDays(editedDays);
    }

    return (
        <>
            <div className="w-auto space-x-2 flex flex-row justify-between">
                <h2 className="flex items-center min-w-14 align-bottom">Day {day.dayNumber}</h2>
                <div className="flex w-[800px]">
                    <InputSmall onChange={handleInputChange} type="text" placeholder="Theme" name="description" value={day.description} />
                </div>
                <PrimaryBtn onClick={handleAddEvent}> + Add Event</PrimaryBtn>
                <div className="flex items-end">
                    <PrimaryBtn onClick={() => handleAddDays(day.dayNumber - 1)}>+</PrimaryBtn>
                </div>
                <TrashBtn handleDelete={() => handleDeleteDay(day.dayNumber - 1)} />
            </div>
            <div>
                {day.events.length > 0
                    ?
                    <table className="table table-sm table-fixed">
                        <thead>
                            <tr>
                                <th className="w-3/12">Event name</th>
                                <th className="w-4/12">Description</th>
                                <th className="w-1/6">Start</th>
                                <th className="w-1/6">End</th>
                                <th className="w-1/12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {day.events.map((event, index) => <CalendarEvent event={event} key={index} days={days} setDays={setDays} index={index} dayNumber={day.dayNumber} />)}
                        </tbody>
                    </table>
                    : <></>
                }
            </div>
        </>
    )
}