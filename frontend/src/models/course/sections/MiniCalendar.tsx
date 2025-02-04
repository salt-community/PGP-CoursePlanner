import NextBtn from "@components/buttons/NextBtn"
import PreviousBtn from "@components/buttons/PreviousBtn"
import { useEffect, useState } from "react"

import { firstDayOfMonth, allDaysInInterval, fullWeek, daysBeforeMonth, firstWeekDay, getDateAsString, lastDayOfMonth } from "../../../helpers/dateHelpers"
import { format, getMonth, getWeek, getYear } from "date-fns"
import { useQueryCalendarDateBatch } from "@api/calendarDate/calendarDateQueries"
import { CourseType, ModuleType } from "../Types"
import CalendarDate from "./CalendarDate"
import { CalendarDateType } from "@models/calendar/Types"
// import { datePickerToolbarClasses } from "@mui/x-date-pickers"

type Props = {
    startDate: Date
    selectedModule: ModuleType
    selectedModuleStartDate: CalendarDateType
    previewCalendarDays: CalendarDateType[]
    setSelectedModuleStartDate: React.Dispatch<React.SetStateAction<CalendarDateType>>

    previewCourse: CourseType
    setSelectedModule: React.Dispatch<React.SetStateAction<ModuleType>>
}

export default function MiniCalendar({ startDate, previewCalendarDays, selectedModule, selectedModuleStartDate, setSelectedModuleStartDate, previewCourse, setSelectedModule }: Props) {
    const [month, setMonth] = useState<number>(getMonth(startDate));
    const [year, setYear] = useState<number>(getYear(startDate));
    const [calendarData, setCalendarData] = useState<CalendarDateType[]>([]);

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

    const startOfMonthFormatted = getDateAsString(startOfMonth);
    const endOfMonthFormatted = getDateAsString(endOfMonth);

    const { data, isLoading, isError, } = useQueryCalendarDateBatch(startOfMonthFormatted, endOfMonthFormatted);


    useEffect(() => {
        if (!data || !previewCalendarDays) return;

        const previewDaysMap = previewCalendarDays.reduce((acc, day) => {
            const dateKey = getDateAsString(day.date);
            acc[dateKey] = (acc[dateKey] || []).concat(day);
            return acc;
        }, {} as Record<string, typeof previewCalendarDays>);

        const updatedData = data.map(fetchData => {
            const dateKey = getDateAsString(fetchData.date);
            const matchingPreviewDays = previewDaysMap[dateKey] || [];

            const mergedPreviewContent = matchingPreviewDays.flatMap(
                d => d.dateContent
            );
            const filteredExistingContent = fetchData.dateContent.filter(
                dc => dc.appliedCourseId !== previewCourse.id
            );

            return {
                ...fetchData,
                dateContent: [...mergedPreviewContent, ...filteredExistingContent]
            };
        });

        setCalendarData(updatedData);

        const selectedDay = updatedData.find(d => getDateAsString(d.date) == getDateAsString(selectedModuleStartDate.date))
        if (selectedDay) {
            setSelectedModuleStartDate({dateContent: selectedDay.dateContent, date: selectedDay.date})
        }


    }, [data, previewCalendarDays, previewCourse.id, setSelectedModuleStartDate,selectedModuleStartDate.date ]);



    const selectDate = (index: number) => {
        setSelectedModuleStartDate({ dateContent: calendarData[index].dateContent, date: calendarData![index].date })

    };


    const moduleDateStrings = selectedModule.days.map(d => getDateAsString(d.date))


    if (isError) {
        console.log("Query error");
    }
    if (isLoading) return "pending";


    return (
        <>
            {calendarData && <div className="flex flex-col h-full">
                <header className="flex mb-0 p-0 items-center gap-2">
                    <div className="flex items-center">
                        <PreviousBtn onClick={() => { setMonth(month - 1); }} />
                        <NextBtn onClick={() => { setMonth(month + 1); }} />
                    </div>
                    <h1 className="text-3xl">{monthInText} {year}</h1>
                </header>

                <section className="flex-grow flex py-2">
                    <div className="flex flex-col items-center w-full h-full">
                        <div className={`w-full flex-grow   grid grid-cols-7 ${numberOfRows} rounded-md bg-white`}>
                            {fullWeek.map((day, index) => (
                                <div key={`${format(day, 'E')}-${index}`} className="w-1/7 flex justify-center items-center p-1 border-b-2 border-gray-100">
                                    {format(day, 'E')}
                                </div>
                            ))}
                            {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((index) => (
                                <div key={`empty-${index}`} className="w-1/7 h-full"></div>
                            ))}
                            {daysInMonth.map((thisDate, dateIndex) => {

                                if (calendarData[dateIndex]) return (
                                    <CalendarDate
                                        setSelectedModule={setSelectedModule}
                                        previewCourse={previewCourse}
                                        isInSelectedModule={moduleDateStrings.indexOf(getDateAsString(thisDate)) > -1}
                                        isSelectedModuleStartDate={getDateAsString(selectedModuleStartDate.date) === getDateAsString(thisDate)}
                                        openModal={selectDate}
                                        isLoading={isLoading}
                                        indexForModal={dateIndex}
                                        dateContent={calendarData[dateIndex].dateContent}
                                        key={`${getDateAsString(thisDate)}-${dateIndex}`}
                                        date={getDateAsString(thisDate)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </section>
            </div>
            }
        </>
    );

}