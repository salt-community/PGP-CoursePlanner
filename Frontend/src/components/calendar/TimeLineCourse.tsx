import { addDays, format } from "date-fns";
import { Activity } from "../../pages/calendar/HorizontalCalendar";

type Props = {
  dates: Date[],
  course: Activity
}

export default function TimeLineCourse({ dates, course }: Props) {

  const startIndex = dates.findIndex(d => d.getDate() == course.startDate.getDate() && d.getMonth() == course.startDate.getMonth())
  const endIndex = dates.findIndex(d => d.getDate() == course.endDate.getDate() && d.getMonth() == course.endDate.getMonth())
  const width: string = ((course.endDate.getDate() - course.startDate.getDate() + 1) * 40).toString() + "px";

  return (
    <>
      {dates.map((_currentDate, index) => {
        return (
        <div className=" flex flex-col w-full mb-4 mt-4">
          {index == startIndex
            ? <div style={{ backgroundColor: course.color, "width": width}} className="h-10 pl-3 flex items-center font-bold text-white">{course.title} ({format(course.startDate, "d MMM")} - {format(course.endDate, "d MMM")})</div>
            : <>
            {startIndex < index && index <= endIndex
            ? <div className="h-10 font-bold text-white w-0"></div>
            : <div className="h-10 font-bold w-10"></div>}
            </>
          }
        </div>)
      })}
    </>
  )
}