import { format } from "date-fns"
import { allDaysInMonth, currentMonth, currentYear, daysBeforeMonth, firstDayOfMonth, firstWeekDay, formatDate, fullWeek, lastDayOfMonth } from "../../helpers/dateHelpers"
import CalendarLine from "../../components/calendar/CalendarLine"
import NextBtn from "../../components/buttons/NextBtn"
import PreviousBtn from "../../components/buttons/PreviousBtn"
import Page from "../../sections/Page"
import { useState } from "react"
import CalendarDate from "../../components/calendar/CalendarDate"

export default function MonthView() {
    const [month, setMonth] = useState<number>(currentMonth);

    const startOfMonth = firstDayOfMonth(month);
    const endOfMonth = lastDayOfMonth(month);
    const daysInMonth = allDaysInMonth(startOfMonth, endOfMonth);
    const monthInText = format(new Date(currentYear, month, 1), "MMMM");

    return (
        <Page>
            <section className="flex justify-around">
                <div></div>
                <div className="h-[100px] flex items-end">
                    <PreviousBtn onClick={() => setMonth(month - 1)} />
                </div>
                <div className="flex flex-col items-center w-1/2">
                    <header className="mt-5 mb-5">
                        <h1 className="text-3xl">
                            {monthInText}
                        </h1>
                    </header>
                    <div className="justify-center w-full h-96 shadow-xl drop-shadow-2xl break-normal grid grid-cols-7 rounded-md bg-white lg:w-3/5 lg:h-[65vh]">
                        {fullWeek.map(day => (
                            <div key={format(day, 'E')} className="w-1/7 flex self-start items-center justify-center py-1 px-1">{format(day, 'E')}</div>
                        ))}
                        <CalendarLine />
                        {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                            <button key={format(emptyDayIndex, 'd')} className="w-1/7"></button>
                        ))}

                        {daysInMonth.map((thisDate) => {
                            return <CalendarDate key={format(thisDate, 'd')} date={formatDate(thisDate)} />
                        })
                        }
                    </div>
                </div>
                <div className="h-[100px] flex items-end">
                    <NextBtn onClick={() => setMonth(month + 1)} />
                </div>
                <div></div>
            </section>
        </Page>
    )
}