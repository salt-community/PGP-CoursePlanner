import { DateContent } from "../Types";
import { Link } from "react-router-dom";
import { today } from "@helpers/dateHelpers";
import { format } from "date-fns";
import { trackUrl } from "@helpers/helperMethods";

type Props = {
    date: string;
    dateContent: DateContent[] | undefined;
}

export default function WeekDayCalendar({ date, dateContent }: Props) {
    trackUrl();

    const border = today == date ? "border border-2 border-primary hover:border-primary" : "";
    const text = today == date ? "text-primary font-bold" : "";

    return (
        <>
            <Link to={`/calendar/day/date=${date}`}
                className={`${border} rounded-md hover:shadow-md mx-px w-1/7`}>
                <h1 className={`${text} text-center self-start mb-4 mt-2 hover:italic`}>
                    {format(date, 'd')}
                </h1>
                <div className={`rounded-lg flex flex-col justify-start w-full mb-3`}>
                    {dateContent && dateContent.map((content) =>
                        <div key={content.id} style={{ borderColor: content.color }} className="border rounded-md ml-2 mr-2 mb-2 p-1">
                            <h2 style={{ color: content.color }} className="font-bold">
                                <Link to={`/activecourses/details/${content.appliedCourseId}`} className="hover:italic">
                                    {content.courseName}
                                </Link>
                            </h2>
                            <h3 style={{ color: content.color }}>
                                {content.moduleName?.includes("(weekend)")
                                    ? <>
                                        Weekend
                                    </>
                                    : <>
                                        {content.moduleName}
                                    </>
                                }
                            </h3>
                            {content.events.length > 0 && content.events.map(eventItem =>
                                <h3 key={eventItem.name} style={{ color: content.color }}>- {eventItem.name}</h3>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </>
    )
}
