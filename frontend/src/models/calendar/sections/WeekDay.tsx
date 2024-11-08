import { DateContent } from "../Types";
import { Link } from "react-router-dom";

type Props = {
    dateContent: DateContent[] | undefined
}

export default function WeekDay({ dateContent }: Props) {

    return (
        <div className={`rounded-lg flex flex-col justify-start w-full h-full`}>
            {dateContent && dateContent.map((content) =>
                <div key={content.id} style={{ borderColor: content.color }} className="border rounded-md ml-2 mr-2 mb-2 p-2">
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
                                Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                            </>
                        }
                    </h3>
                    {content.events.length > 0 && content.events.map(eventItem =>
                        <h3 key={eventItem.name} style={{ color: content.color }}>{eventItem.name}: {eventItem.startTime}-{eventItem.endTime}</h3>
                    )}
                </div>
            )}
        </div>
    )
}
