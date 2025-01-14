import NextBtn from "@components/buttons/NextBtn"
import PreviousBtn from "@components/buttons/PreviousBtn"
import Page from "@components/Page"
import { useState } from "react"
import CalendarDate from "../sections/CalendarDate"
import { useNavigate } from "react-router-dom"
import { firstDayOfMonth, allDaysInInterval, fullWeek, daysBeforeMonth, firstWeekDay, getDateAsString, lastDayOfMonth } from "../../../helpers/dateHelpers"
import { format, getMonth, getWeek, getYear } from "date-fns"
import { useMonthFromPath, useYearFromPath } from "@helpers/helperHooks"
import { useQueryCalendarDateBatch } from "@api/calendarDate/calendarDateQueries"
import { trackUrl } from "@helpers/helperMethods"
import { DayModal } from "@models/home/sections/DayModal"
import Header from "@components/Header"
import { weeksCalc } from "../helpers/weeksCalc"

export default function MonthView() {
    const [month, setMonth] = useState<number>(parseInt(useMonthFromPath()));
    const [year, setYear] = useState<number>(parseInt(useYearFromPath()));
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const navigate = useNavigate();
    trackUrl();

    const startOfMonth = firstDayOfMonth(month, year);
    const endOfMonth = lastDayOfMonth(month, year);
    const daysInMonth = allDaysInInterval(startOfMonth, endOfMonth);
    const monthInText = format(new Date(year, month, 1), "MMMM");

    if (getMonth(startOfMonth) != month && getYear(endOfMonth) != year) {
        setMonth(getMonth(startOfMonth));
        setYear(getYear(endOfMonth));
    }

    const numberOfWeeks = getWeek(endOfMonth) - getWeek(startOfMonth) + 1;
    const numberOfRows = "grid-rows-" + (numberOfWeeks + 1).toString();

    const startOfMonth2 = getDateAsString(startOfMonth);
    const endOfMonth2 = getDateAsString(endOfMonth);

    const { data, isPending, isError, error } = useQueryCalendarDateBatch(startOfMonth2, endOfMonth2);

    const openModal = (index: number) => {
        setCurrentIndex(index);
    };

    const closeModal = () => {
        setCurrentIndex(null);
    };

    const handleNextDay = () => {
        if (data && currentIndex !== null && currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevDay = () => {
        if (data && currentIndex !== null && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };


    if (isError) {
        console.log("Query error:", error);
    }
    if (isPending) return "pending";
    console.log(weeksCalc(year, month, endOfMonth2.slice(3, 5)).length);

    return (
        <Page >
            <Header>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <PreviousBtn onClick={() => { setMonth(month - 1); navigate(`/calendar/month/monthyear=${month - 1}-${year}`); }} />
                        <NextBtn onClick={() => { setMonth(month + 1); navigate(`/calendar/month/monthyear=${month + 1}-${year}`); }} />
                    </div>
                    <h1 className="text-3xl font-semibold">{monthInText} {year}</h1>
                    <select className="select select-bordered select-sm max-w-xs ">
                        <option disabled selected>Month</option>
                    </select>
                </div>
            </Header>

            <section className="flex flex-grow bg-white rounded-l-xl drop-shadow-xl">
                <div className={`flex flex-col h-full bg-accent rounded-l-xl drop-shadow-xl`}>
                    <div className="min-h-6"></div>
                    {weeksCalc(year, month, endOfMonth2.slice(3, 5)).map(week => (
                        <p className="min-w-10 p-2 h-full text-lg text-center border-t-[0.5px] border-gray-100">{week}</p>
                    ))}
                </div>
                <div className="flex flex-col items-center w-full">
                    <div className="w-full grid grid-cols-7">
                        {fullWeek.map(day => (
                            <div key={format(day, 'E')} className="flex justify-center items-center p-">{format(day, 'E')}</div>
                        ))}
                    </div>
                    <div className={`w-full flex-grow break-normal grid grid-cols-7 ${numberOfRows}`}>
                        {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                            <div key={format(emptyDayIndex, 'd')} className="w-1/7 h-full border-t-[0.5px] border-b-[0.5px] border-gray-100"></div>
                        ))}
                        {daysInMonth.map((thisDate, dateIndex) => {
                            return <div key={format(thisDate, 'yyyy-MM-dd')} className="flex flex-col">
                                {data && data[dateIndex] !== null ? <CalendarDate openModal={openModal} indexForModal={dateIndex} dateContent={data[dateIndex].dateContent} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                    : <CalendarDate openModal={openModal} indexForModal={dateIndex} dateContent={[]} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />}
                            </div>
                        })}
                    </div>
                </div>
            </section>
            {currentIndex !== null && data && (
                <DayModal
                    modalData={data[currentIndex]}
                    onClose={closeModal}
                    onNext={handleNextDay}
                    onPrev={handlePrevDay}
                    isPrevDisabled={currentIndex === 0}
                    isNextDisabled={currentIndex === data.length - 1}
                />
            )}
        </Page>
    )
}