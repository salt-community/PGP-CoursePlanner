import { addDays, format } from "date-fns";

type Props = {
  dates: Date[],
  width: number
}

export default function TimeLineXaxis({ dates, width }: Props) {

  var widthString = width + "px";

  return (
    <>
      {dates.map((currentDate) => {
        return (
        <div className="mb-2 flex">
          {currentDate.getDay() == 1
            ? <div style={{ "width": widthString}} className="font-bold">{format(currentDate, "MMM d")}</div>
            : <div style={{ "width": widthString}} className="font-bold"></div>
          }
        </div>
        )
      })}
    </>
  )
}