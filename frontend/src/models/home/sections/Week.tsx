import { useEffect, useState } from "react";
import { DayModal } from "./DayModal";
import { weekDays, getDateAsString, today } from "@helpers/dateHelpers";
import { CalendarDateType } from "@models/calendar/Types";
import { format, getWeek } from "date-fns";
import WeekDay from "@models/calendar/sections/WeekDay";
import LoadingSkeleton from "../components/LoadingSkeleton";

interface WeekProps {
    data: CalendarDateType[] | undefined;
    isNextWeek: boolean;
    isCalendarLoading: boolean
}

export default function Week({ data, isNextWeek, isCalendarLoading }: WeekProps) {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const thisWeek = getWeek(new Date());
    const nextWeek = getWeek(new Date().setDate(new Date().getDate() + 7));
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const openModal = (index: number) => {
        setCurrentIndex(index);
    };

    const closeModal = () => {
        setCurrentIndex(null);
    };

    useEffect(() => {
        // Add or remove the 'modal-open' class on the <html> element
        if (currentIndex !== null) {
            document.documentElement.classList.add("modal-open");
        } else {
            document.documentElement.classList.remove("modal-open");
        }

        return () => document.documentElement.classList.remove("modal-open");
    }, [currentIndex]);

    const handleNextDay = () => {
        if (data && currentIndex !== null && currentIndex < data.length - 1) {
            if (currentIndex == 4) return setCurrentIndex(currentIndex + 3)  //skip weekend
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevDay = () => {
        if (data && currentIndex !== null && currentIndex > 0) {
            if (currentIndex == 7) return setCurrentIndex(currentIndex - 3) //skip weekend
            setCurrentIndex(currentIndex - 1);
        }
    };

    const renderSection = (day: Date, index: number, isToday: boolean) => {
        if (isNextWeek) {
            index += 7;
            const weekAheadDay = new Date(day);
            weekAheadDay.setDate(day.getDate() + 7);
            day = weekAheadDay;
            isToday = false;
        }
        const commonClasses = "flex flex-col w-full gap-3 p-3 min-h-[400px]";
        const hoverClasses = "hover:bg-[#F9F9F9] hover:cursor-pointer";
        const borderClasses = "border-l-[0.5px] border-3-[0.5px] border-accent";
        const backgroundClasses = "bg-white";
        const textClasses = "text-lg";
        const isTodayTextClasses = isToday && "text-xl font-bold text-primary";
        const formattedDay = getDateAsString(day);

        return (
            <section
                key={formattedDay}
                className={`${commonClasses} ${borderClasses} ${backgroundClasses} ${!isCalendarLoading && hoverClasses}`}
                onClick={isCalendarLoading ? () => { } : () => openModal(index)}
            >
                <h2 className={`item-center text-center ${textClasses} ${isTodayTextClasses}`}>
                    {format(formattedDay, "EEEE")}<br />
                    {day.getDate()} {monthNames[day.getMonth()]}
                </h2>
                {isCalendarLoading ?
                    <LoadingSkeleton />
                    :
                    <>
                        {data && data[index] !== null ? <WeekDay dateContent={data[index].dateContent} /> : ""}
                    </>
                }
            </section>
        );
    };

    return (
        <>
            <section className="flex w-full justify-between m-5 mt-0 rounded-xl bg-accent drop-shadow-xl">
                <p className="min-w-8 p-1 text-center text-lg">{!isNextWeek ? thisWeek : nextWeek}</p>
                {weekDays.map((day, index) => renderSection(day, index, getDateAsString(day) === today))}
            </section>
            {currentIndex !== null && data && (
                <DayModal
                    modalData={data[currentIndex]}
                    onClose={closeModal}
                    onNext={handleNextDay}
                    onPrev={handlePrevDay}
                    isPrevDisabled={currentIndex === 0}
                    isNextDisabled={currentIndex === data.length - 3}
                />
            )}
        </>
    );
}
