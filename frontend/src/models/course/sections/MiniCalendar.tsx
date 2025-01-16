import NextBtn from "@components/buttons/NextBtn"
import PreviousBtn from "@components/buttons/PreviousBtn"
import { useState } from "react"

import { firstDayOfMonth, allDaysInInterval, fullWeek, daysBeforeMonth, firstWeekDay, getDateAsString, lastDayOfMonth } from "../../../helpers/dateHelpers"
import { format, getMonth, getWeek, getYear } from "date-fns"
import { useQueryCalendarDateBatch } from "@api/calendarDate/calendarDateQueries"
import { CalendarDateType, CourseType, DateContentModified, ModuleType } from "../Types"
import CalendarDate from "./CalendarDate"
import { DateContent } from "@models/calendar/Types"

type Props = {
    startDate: Date
    selectedModule: ModuleType
    selectedModuleStartDate: Date
    previewCalendarDays: CalendarDateType[]
    setSelectedModuleStartDate: React.Dispatch<React.SetStateAction<Date>>
    previewCourse: CourseType
    setSelectedModule: React.Dispatch<React.SetStateAction<ModuleType>>
}

export default function MiniCalendar({ startDate, previewCalendarDays, selectedModule, selectedModuleStartDate, setSelectedModuleStartDate, previewCourse, setSelectedModule }: Props) {
    const [month, setMonth] = useState<number>(startDate.getMonth());
    const [year, setYear] = useState<number>(startDate.getFullYear());


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

    const { data, isLoading, isError, } = useQueryCalendarDateBatch(startOfMonth2, endOfMonth2); 



    const selectDate = (index: number) => {
        setSelectedModuleStartDate(data![index].date)
    };


    if (isError) {
        console.log("Query error");
    }
    if (isLoading) return "pending";

    const moduleDateStrings = selectedModule.days.map(d => getDateAsString(d.date))

    
    const transformDateContent = (content: DateContent[]): DateContentModified[] => {
        return content.map(item => ({
            ...item,
            moduleId: -1, 
        }));
    };

    
    return (
        <>
            {data && <div className="flex flex-col h-full">
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
                            {fullWeek.map(day => (
                                <div key={format(day, 'E')} className="w-1/7 flex justify-center items-center p-1 border-b-2 border-gray-100">
                                    {format(day, 'E')}
                                </div>
                            ))}
                            {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                                <div key={format(emptyDayIndex, 'd')} className="w-1/7 h-full"></div>
                            ))}
                            {daysInMonth.map((thisDate, dateIndex) => {

                                const previewCalendarDaysIndex = previewCalendarDays.map(d => d.date.toDateString()).indexOf(thisDate.toDateString())

                                if (previewCalendarDaysIndex > -1) {
                                    if (data[dateIndex] != null) {
                                        previewCalendarDays[previewCalendarDaysIndex].dateContent.push( ...transformDateContent(data![dateIndex].dateContent));
                                    }
                                    return (
                                        <div key={format(thisDate, 'yyyy-MM-dd')} className="flex flex-col">
                                            {data && data[dateIndex] !== null ? (
                                                <CalendarDate setSelectedModule={setSelectedModule} previewCourse={previewCourse} isInSelectedModule={moduleDateStrings.indexOf(getDateAsString(thisDate)) > -1} isSelectedModuleStartDate={getDateAsString(selectedModuleStartDate) == getDateAsString(thisDate)} openModal={selectDate} isLoading={isLoading} indexForModal={dateIndex} dateContent={previewCalendarDays[previewCalendarDaysIndex].dateContent} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                            ) : (
                                                <CalendarDate setSelectedModule={setSelectedModule} previewCourse={previewCourse} isInSelectedModule={moduleDateStrings.indexOf(getDateAsString(thisDate)) > -1} isSelectedModuleStartDate={getDateAsString(selectedModuleStartDate) == getDateAsString(thisDate)} openModal={selectDate} isLoading={isLoading} indexForModal={dateIndex} dateContent={previewCalendarDays[previewCalendarDaysIndex].dateContent} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                            )}

                                        </div>
                                    )
                                }
                                return (
                                    <div key={format(thisDate, 'yyyy-MM-dd')} className="flex flex-col">
                                        {data && data[dateIndex] !== null ? (
                                            <CalendarDate setSelectedModule={setSelectedModule} previewCourse={previewCourse} isInSelectedModule={moduleDateStrings.indexOf(getDateAsString(thisDate)) > -1} isSelectedModuleStartDate={getDateAsString(selectedModuleStartDate) == getDateAsString(thisDate)} openModal={selectDate} isLoading={isLoading} indexForModal={dateIndex} dateContent={transformDateContent(data[dateIndex].dateContent)} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                        ) : (
                                            <CalendarDate setSelectedModule={setSelectedModule} previewCourse={previewCourse} isInSelectedModule={moduleDateStrings.indexOf(getDateAsString(thisDate)) > -1} isSelectedModuleStartDate={getDateAsString(selectedModuleStartDate) == getDateAsString(thisDate)} openModal={selectDate} isLoading={isLoading} indexForModal={dateIndex} dateContent={[]} key={format(thisDate, 'd')} date={getDateAsString(thisDate)} />
                                        )}

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
            }
        </>
    );

}