import { format } from "date-fns"
import { allDaysInMonth, daysBeforeMonth, fullWeek, month, weekDays } from "../../helpers/dateHelpers"
import CalendarLine from "../../components/CalendarLine"

export default function MonthView() {
    return (
        <div className="flex flex-col items-center">
            <header className="mt-20 mb-5">
                <h1 className="text-3xl">
                    {month}
                </h1>
            </header>
            <div className="flex justify-center w-80 h-64 shadow-xl drop-shadow-2xl break-normal grid grid-cols-7 rounded-md bg-white lg:w-3/5 lg:h-[65vh]">
                {fullWeek.map(day => (
                    <div key={format(day, 'E')} className="w-1/7 flex items-center justify-center py-1 px-1">{format(day, 'E')}</div>
                ))}
                <CalendarLine />
                {daysBeforeMonth.map((emptyDayIndex) => (
                    <button key={format(emptyDayIndex, 'd')} className="w-1/7"></button>
                ))}

                {allDaysInMonth.map((thisDate) => {
                    return <button key={format(thisDate, 'd')}>{format(thisDate, 'd')}</button>
                })
                }
            </div>
        </div>
    )
}