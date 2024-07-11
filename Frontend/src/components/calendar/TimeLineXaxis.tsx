import { addDays, format } from "date-fns";

type Props = {
  dates: Date[]
}

export default function TimeLineXaxis({ dates }: Props) {

  return (
    <>
      {dates.map((currentDate) => {
        return (
        <div className="w-full mb-2 flex">
          {currentDate.getDay() == 1
            ? <div className="font-bold w-10">{format(currentDate, "MMM d")}</div>
            : <div className="font-bold w-10"></div>
          }
        </div>)
      })}
    </>
  )
}