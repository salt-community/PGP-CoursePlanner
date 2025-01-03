import { useEffect, useState } from "react";
import { DayModal } from "./DayModal";
import { weekDays, getDateAsString, today } from "@helpers/dateHelpers";
import { CalendarDateType } from "@models/calendar/Types";
import { format, getWeek } from "date-fns";
import WeekDay from "@models/calendar/sections/WeekDay";

interface WeekProps {
    data: CalendarDateType[] | undefined;
    isNextWeek: boolean;
}

export default function Week({ data, isNextWeek }: WeekProps) {
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
        const commonClasses = "flex flex-col w-full gap-3 p-3";
        const borderClasses = isToday ? "border-2 border-primary" : "border-l border-accent";
        const backgroundClasses = "bg-white";
        const textClasses = isToday ? "text-xl font-bold text-primary" : "text-lg";
        const formattedDay = getDateAsString(day);

        return (
            <section
                key={format(day, "d")}
                className={`${commonClasses} ${borderClasses} ${backgroundClasses}`}
                onClick={() => openModal(index)}
            >
                <h1 className={`item-center text-center ${textClasses}`}>
                    {format(formattedDay, "EEEE")}<br />
                    {day.getDate()} {monthNames[day.getMonth()]}
                </h1>
                {data && data[index] !== null ? <WeekDay dateContent={data[index].dateContent} /> : ""}
            </section>
        );
    };

    return (
        <>
            <section className="flex w-full justify-between m-5 rounded-xl bg-accent overflow-hidden drop-shadow-xl">
                <p className="p-1">{!isNextWeek ? thisWeek : nextWeek}</p>
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
