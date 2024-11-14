import { format } from "date-fns"
import { daysBetweenDates } from "@helpers/dateHelpers"
import { Activity } from "../pages/HorizontalCalendar"
import { Link } from "react-router-dom"

type Props = {
  dates: Date[],
  courses: Activity[],
  width: number
}

export default function TimeLineCourse({ dates, courses, width }: Props) {
  const startIndices: number[] = [];
  const endIndices: number[] = [];
  const widthStrings: string[] = [];

  courses.forEach(course => {
    const startIndex = dates.findIndex(d => d.getDate() == course.startDate.getDate() && d.getMonth() == course.startDate.getMonth())
    const endIndex = dates.findIndex(d => d.getDate() == course.endDate.getDate() && d.getMonth() == course.endDate.getMonth())
    const widthString: string = ((daysBetweenDates(course.startDate, course.endDate) + 1) * width).toString() + "px";

    startIndices.push(startIndex);
    endIndices.push(endIndex);
    widthStrings.push(widthString);
  });

  let startIndex = 1000;
  let endIndex = 0;

  return (
    <>
      {dates.map((_currentDate, index) => {
        const startIndexMatch = startIndices.findIndex(i => i == index);
        if (startIndexMatch != -1) {
          startIndex = startIndices[startIndexMatch];
          endIndex = endIndices[startIndexMatch];
        }
        return (
          <div key={index}className=" flex flex-col mb-4 mt-4">
            {startIndexMatch != -1
              ? <div style={{ backgroundColor: courses[0].color, "width": widthStrings[startIndexMatch] }} className="h-10 pl-3 flex items-center font-bold text-white">
                <Link to={`/activecourses/details/${courses[startIndexMatch].id}`} className="hover:italic">
                  {courses[startIndexMatch].title} ({format(courses[startIndexMatch].startDate, "d MMM")} - {format(courses[startIndexMatch].endDate, "d MMM")})
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