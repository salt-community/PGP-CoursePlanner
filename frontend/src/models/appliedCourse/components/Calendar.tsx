import NextBtn from "@components/buttons/NextBtn";
import PreviousBtn from "@components/buttons/PreviousBtn";
import { useState } from "react";
import {
  format,
  getMonth,
  getYear,
  getWeek,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  differenceInCalendarDays,
} from "date-fns";
import { CourseType } from "@models/course/Types";

type Props = {
  course: CourseType;
};

export default function Calendar({ course }: Props) {
  const startDateObj = new Date(course.startDate);
  if (isNaN(startDateObj.getTime())) {
    console.error("Invalid startDate");
    return null;
  }

  const [month, setMonth] = useState<number>(startDateObj.getMonth());
  const [year, setYear] = useState<number>(startDateObj.getFullYear());

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(year, month + direction, 1);
    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
  };

  const currentMonthStart = startOfMonth(new Date(year, month, 1));
  const currentMonthEnd = endOfMonth(currentMonthStart);

  const calendarStart = startOfWeek(currentMonthStart, { weekStartsOn: 1 });

  const totalDays = differenceInCalendarDays(
    addDays(currentMonthEnd, 6 - currentMonthEnd.getDay()),
    calendarStart
  ) + 1;

  const calendarDays = Array.from({ length: totalDays }, (_, i) =>
    addDays(calendarStart, i)
  );

  const getCourseDays = (course: CourseType) => {
    return course.modules.flatMap((module) =>
      module.module.days.map((day) => ({
        date: new Date(day.date),
        moduleName: module.module.name,
      }))
    );
  };

  const courseDays = getCourseDays(course);

  return (
    <div className="flex flex-col h-full">

      <header className="flex mb-2 p-2 items-center gap-4">
        <div className="flex items-center gap-2">
          <PreviousBtn onClick={() => handleMonthChange(-1)} />
          <NextBtn onClick={() => handleMonthChange(1)} />
        </div>
        <h1 className="text-3xl font-bold">
          {`${format(currentMonthStart, "MMMM")} ${year}`}
        </h1>
      </header>

      <section className="flex-grow flex py-2 p-1">
        <div className="flex flex-row items-start w-full h-full">
          <div className="flex flex-col items-center bg-gray-50 border-l-2 border-t-2 rounded-md border-gray-300">
            <div className="w-8 h-12 bg-gray-100  border-b-2 border-gray-300 flex justify-center items-center font-bold">
              
            </div>
            {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, index) => {
              const weekStart = addDays(calendarStart, index * 7);
              return (
                <div
                  key={`week-${index}`}
                  className="w-8 h-12 flex justify-center items-center font-semibold border-b border-gray-300"
                >
                  {getWeek(weekStart, { weekStartsOn: 1 })}
                </div>
              );
            })}
          </div>
          <div className="w-full flex-grow grid grid-cols-7 auto-rows-[3rem] bg-white border-2 border-gray-300">
          
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="h-12 flex justify-center items-center border-b-2 border-l-2 border-gray-300 bg-gray-100 font-bold"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((thisDate) => {
              const isCurrentMonth = getMonth(thisDate) === month;
              const courseDay = courseDays.find(
                (day) =>
                  format(day.date, "yyyy-MM-dd") ===
                  format(thisDate, "yyyy-MM-dd")
              );

              return (
                <div
                key={format(thisDate, "yyyy-MM-dd")}
                className={`flex flex-col border border-gray-200`}
              >
                {isCurrentMonth ? (
                  <>
                    <div className="w-full h-10 flex justify-center items-center">
                      <p className="font-semibold">{format(thisDate, "d")}</p>
                    </div>
                    {courseDay && (
                      <div className="left-0 w-full p-1 bg-purple-200 text-xs text-center rounded-b-md mt-1 overflow-hidden">
                        <p>{courseDay.moduleName}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>

              );
            })}
          </div>
        </div>
      </section>
    </div>



  );
}
