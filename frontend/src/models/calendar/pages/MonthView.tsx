import NextBtn from "@components/buttons/NextBtn"
import PreviousBtn from "@components/buttons/PreviousBtn"
import Page from "@components/Page"
import { Fragment, useState } from "react"
import CalendarDate from "../sections/CalendarDate"
import { useNavigate } from "react-router-dom"
import { firstDayOfMonth, allDaysInInterval, fullWeek, daysBeforeMonth, firstWeekDay, getDateAsString, lastDayOfMonth } from "../../../helpers/dateHelpers"
import { format, getMonth, getWeek, getYear} from "date-fns"
import { useMonthFromPath, useYearFromPath } from "@helpers/helperHooks"
import { useQueryCalendarDateBatch } from "@api/calendarDate/calendarDateQueries"
import { trackUrl } from "@helpers/helperMethods"
import { DayModal } from "@models/home/sections/DayModal"
import Header from "@components/Header"
import { weeksCalc } from "../helpers/weeksCalc"
import ErrorModal from "@components/ErrorModal"

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

    const startOfMonth2 = getDateAsString(startOfMonth);
    const endOfMonth2 = getDateAsString(endOfMonth);
    const numberOfWeeks = weeksCalc(endOfMonth2);

    const { data, isLoading, isError } = useQueryCalendarDateBatch(startOfMonth2, endOfMonth2);

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

    function handleNextMonth() {
        setMonth(month === 11 ? 0 : month + 1);
        if (month === 11) {
            setYear(year + 1);
        }
        navigate(`/calendar/month/monthyear=${month === 11 ? 0 : month}-${month === 11 ? year + 1 : year}`)
    }

    function handlePrevMonth() {
        setMonth(month === 0 ? 11 : month - 1);
        if (month === 0) {
            setYear(year - 1);
        }
        navigate(`/calendar/month/monthyear=${month === 0 ? 11 : month - 1}-${month === 0 ? year - 1 : year}`)
    }

    const weeks: number[] = [];
    function handleWeek(date: Date) {
        const monthIndex = parseInt(getDateAsString(date).slice(0, 2)) - 1;
        const day = parseInt(getDateAsString(date).slice(3, 5));
        const year = parseInt(getDateAsString(date).slice(6, 10));
        const weekNumber: number = getWeek(new Date(year, monthIndex, day, 0, 0, 0, -1));

        if (weekNumber && !weeks.includes(weekNumber)) {
            weeks.push(weekNumber);
            return weekNumber;
        }
    }

    return (
        <Page >
            <Header>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <PreviousBtn onClick={() => handlePrevMonth()} />
                        <NextBtn onClick={() => handleNextMonth()} />
                    </div>
                    <h1 className="text-3xl font-semibold">{monthInText} {year}</h1>
                    <select className="select select-bordered select-sm max-w-xs ">
                        <option disabled selected>Month</option>
                    </select>
                </div>
            </Header>

            <section className={`grid w-full h-full bg-white rounded-l-xl drop-shadow-xl`} style={{ gridTemplateRows: `24px repeat(${numberOfWeeks}, 1fr)`, gridTemplateColumns: `32px repeat(7, 1fr)` }}>
                <div className="bg-accent rounded-tl-xl border-r-[0.5px] border-gray-100"></div>
                {fullWeek.map(day => (
                    <div key={format(day, 'E')} className="flex justify-center items-center p-">{format(day, 'E')}</div>
                ))}

                <p className="bg-accent col-start-1 col-end-2 min-w-8 p-1 h-full text-lg text-center border-t-[0.5px] border-r-[0.5px] border-gray-100">{handleWeek(startOfMonth)}</p>

                {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                    <div key={format(emptyDayIndex, 'd')} className="border-t-[0.5px] border-b-[0.5px] border-gray-100"></div>
                ))}

                {daysInMonth.map((thisDate, dateIndex) => {
                    const weekNumber = handleWeek(thisDate);
                    return (
                        <Fragment key={format(thisDate, 'yyyy-MM-dd')}>
                            {weekNumber && <p className="bg-accent col-start-1 col-end-2 min-w-8 p-1 h-full text-lg text-center border-t-[0.5px] border-r-[0.5px] border-gray-100">{weekNumber}</p>}
                            <div className="flex flex-col">
                                {data && data[dateIndex] !== null ? <CalendarDate isLoading={isLoading} openModal={openModal} indexForModal={dateIndex} dateContent={data[dateIndex].dateContent} date={getDateAsString(thisDate)} />
                                    : <CalendarDate isLoading={isLoading} openModal={openModal} indexForModal={dateIndex} dateContent={[]} date={getDateAsString(thisDate)} />}
                            </div>
                        </Fragment>)
                })}
            </section>
            {isError && <ErrorModal error="Days" />}
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