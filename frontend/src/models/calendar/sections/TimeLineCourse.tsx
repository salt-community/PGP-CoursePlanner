import { format } from "date-fns"
import { daysBetweenDates } from "../../../helpers/dateHelpers"
import { Activity } from "../pages/HorizontalCalendar"
import { Link } from "react-router-dom"


type Props = {
  dates: Date[],
  course: Activity,
  width: number
}

export default function TimeLineCourse({ dates, course, width }: Props) {

  const startIndex = dates.findIndex(d => d.getDate() == course.startDate.getDate() && d.getMonth() == course.startDate.getMonth())
  const endIndex = dates.findIndex(d => d.getDate() == course.endDate.getDate() && d.getMonth() == course.endDate.getMonth())
  const widthString: string = ((daysBetweenDates(course.startDate, course.endDate) + 1) * width).toString() + "px";

  return (
    <>
      {dates.map((_currentDate, index) => {
        return (
          <div className=" flex flex-col mb-4 mt-4">
            {index == startIndex
              ? <div style={{ backgroundColor: course.color, "width": widthString }} className="h-10 pl-3 flex items-center font-bold text-white">
                <Link to={`/activecourses`} className="hover:italic">
                  {course.title} ({format(course.startDate, "d MMM")} - {format(course.endDate, "d MMM")})
                </Link>
              </div>
              : <>
                {startIndex < index && index <= endIndex
                  ? <div className="h-10 font-bold text-white w-0"></div>
                  : <div style={{ "width": width + "px" }} className="h-10 font-bold"></div>}
              </>
            }
          </div>)
      })}
    </>
  )
}