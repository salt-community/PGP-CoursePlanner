import NextBtn from "@components/buttons/NextBtn";
import PreviousBtn from "@components/buttons/PreviousBtn";
import { useState, useEffect } from "react";
import { format, getMonth, getYear, getWeek } from "date-fns";
import {
  getDateAsString,
  firstDayOfMonth,
  lastDayOfMonth,
  allDaysInInterval,
  fullWeek,
  daysBeforeMonth,
  firstWeekDay,
} from "../../../helpers/dateHelpers";
import { CourseType } from "@models/course/Types";

type Props = {
  course: CourseType
};

export default function Calendar({course}: Props) {
  const startDateObj = new Date(course.startDate);
  if (isNaN(startDateObj.getTime())) {
    console.error("Invalid startDate");
    return null;
  }
  const [month, setMonth] = useState<number>(startDateObj.getMonth());
  const [year, setYear] = useState<number>(startDateObj.getFullYear());

  const startOfMonth = firstDayOfMonth(month, year);
  const endOfMonth = lastDayOfMonth(month, year);
  const daysInMonth = allDaysInInterval(startOfMonth, endOfMonth);
  const monthInText = format(new Date(year, month, 1), "MMMM");

  useEffect(() => {
    if (getMonth(startOfMonth) !== month || getYear(endOfMonth) !== year) {
      setMonth(getMonth(startOfMonth));
      setYear(getYear(endOfMonth));
    }
  }, [startOfMonth, endOfMonth]);

  const numberOfWeeks = getWeek(endOfMonth) - getWeek(startOfMonth) + 1;
  const numberOfRows = "grid-rows-" + (numberOfWeeks + 1).toString();

  function getCourseDays(course: CourseType): { date: Date; moduleName: string }[] {
          const daysWithModules: { date: Date; moduleName: string }[] = [];
          course.modules.forEach((module) => {
              module.module.days.forEach((day) => {
                  if (day.date) {
                      daysWithModules.push({
                          date: new Date(day.date),
                          moduleName: module.module.name,
                      });
                  }
              });
          });
          return daysWithModules;
      }

  return (
    <div className="flex flex-col h-full">
      <header className="flex mb-0 p-0 items-center gap-2">
        <div className="flex items-center">
          <PreviousBtn onClick={() => setMonth(month - 1)} />
          <NextBtn onClick={() => setMonth(month + 1)} />
        </div>
        <h1 className="text-3xl">{monthInText} {year}</h1>
      </header>

      <section className="flex-grow flex py-2">
        <div className="flex flex-col items-center w-full h-full">
          <div className={`w-full flex-grow grid grid-cols-7 ${numberOfRows} rounded-md bg-white`}>
            
            {fullWeek.map((day) => (
              <div key={format(day, "E")} className="w-1/7 flex justify-center items-center p-1 border-b-2 border-gray-100">
                {format(day, "E")}
              </div>
            ))}
            {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
              <div key={format(emptyDayIndex, "d")} className="w-1/7 h-full"></div>
            ))}
            {daysInMonth.map((thisDate) => {
              const dateString = getDateAsString(thisDate);
              const courseDay = getCourseDays(course).find(
                (day) => getDateAsString(day.date) === dateString
              );

              return (
                <div key={format(thisDate, "yyyy-MM-dd")} className="flex flex-col relative">
                  <div className="w-full h-10 flex justify-center items-center">
                    <p className="font-semibold">{format(thisDate, "d")}</p>
                  </div>
                  {courseDay && (
                    <div className="left-0 w-full p-1 bg-purple-200 text-xs text-center rounded-b-md mt-1">
                      <p>{courseDay.moduleName}</p>
                    </div>
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
