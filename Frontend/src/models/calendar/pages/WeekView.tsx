import { format } from "date-fns";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NextBtn from "../../../components/buttons/NextBtn";
import PreviousBtn from "../../../components/buttons/PreviousBtn";
import Page from "../../../components/Page";
import { fullWeek } from "../../../helpers/dateHelpers";
import { getWeekFromPath } from "../../../helpers/helperMethods";
import { getCookie } from "../../../helpers/cookieHelpers";
import NavigateToLogin from "../../login/NavigateToLogin";


export default function MonthView() {
    const [week, setWeek] = useState<number>(parseInt(getWeekFromPath()));
    const navigate = useNavigate();

    // const startOfMonth = firstDayOfMonth(month);
    // const endOfMonth = lastDayOfMonth(month);
    // const daysInMonth = allDaysInMonth(startOfMonth, endOfMonth);
    // const monthInText = format(new Date(currentYear, month, 1), "MMMM");

    // const numberOfWeeks = getWeek(endOfMonth) - getWeek(startOfMonth) + 1;
    // const numberOfRows = "grid-rows-" + (numberOfWeeks + 1).toString();

    return (
        getCookie("access_token") == undefined ?
            <NavigateToLogin />
            :
            <Page>
                <section className="flex justify-around">
                    <div></div>
                    <div className="h-[100px] flex items-end">
                        <PreviousBtn onClick={() => { setWeek(week - 1); navigate(`/calendar/week/weeknumber=${week - 1}`); }} />
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                        <header className="mt-5 mb-5">
                            <h1 className="text-3xl">
                                Week {week}
                            </h1>
                        </header>
                        <div className={`justify-center w-full shadow-xl drop-shadow-2xl break-normal grid grid-cols-7 grid-rows-2 rounded-md bg-white lg:w-3/5`}>
                            {fullWeek.map(day => (
                                <div key={format(day, 'E')} className="h-16 w-1/7 flex items-center justify-center py-1 px-1 border-b-2 border-gray-100 border-3">{format(day, 'E')}</div>
                            ))}
                            {/* {daysBeforeMonth(startOfMonth, firstWeekDay(startOfMonth)).map((emptyDayIndex) => (
                            <button key={format(emptyDayIndex, 'd')} className="w-1/7 h-16"></button>
                        ))}

                        {daysInMonth.map((thisDate) => {
                            return <CalendarDate key={format(thisDate, 'd')} date={formatDate(thisDate)} />
                        })
                        } */}
                        </div>
                        <div className="flex flex-row gap-2">
                            <Link to={`/calendar/month`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to month view</Link>
                            <Link to={`/calendar/timeline`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to timeline</Link>
                        </div>
                    </div>
                    <div className="h-[100px] flex items-end">
                        <NextBtn onClick={() => { setWeek(week + 1); navigate(`/calendar/week/weeknumber=${week + 1}`); }} />
                    </div>
                    <div></div>
                </section>
            </Page>
    )
}