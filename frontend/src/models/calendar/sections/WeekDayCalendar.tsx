import { DateContent } from "../Types";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "../../../api/CourseApi";
import { getAllModules } from "../../../api/ModuleApi";
import { today } from "../../../helpers/dateHelpers";
import { format } from "date-fns";
import { trackUrl } from "../../../helpers/helperMethods";

type Props = {
    date: string;
    dateContent: DateContent[] | undefined;
}

export default function WeekDayCalendar({ date, dateContent }: Props) {
    trackUrl();

    const border = today == date ? "border border-2 border-primary hover:border-primary" : "";
    const text = today == date ? "text-primary font-bold" : "";

    const courseIds: number[] = [];
    const moduleIds: number[] = [];

    if (dateContent) {
        const { data: allCourses } = useQuery({
            queryKey: ['courses'],
            queryFn: () => getAllCourses()
        });
        dateContent.forEach(dc => {
            const courseId = allCourses?.find(c => c.name == dc.courseName)?.id;
            courseIds.push(courseId!);
        });

        const { data: allModules } = useQuery({
            queryKey: ['modules'],
            queryFn: () => getAllModules()
        });
        dateContent.forEach(dc => {
            const moduleId = allModules?.find(m => m.name == dc.moduleName)?.id;
            moduleIds.push(moduleId!);
        });
    }

    return (
        <>
            <Link to={`/calendar/day/date=${date}`}
                className={`${border} rounded-md hover:shadow-md mx-px w-1/7`}>
                <h1 className={`${text} text-center self-start mb-4 mt-2 hover:italic`}>
                    {format(date, 'd')}
                </h1>
                <div className={`rounded-lg flex flex-col justify-start w-full mb-3`}>
                    {dateContent && dateContent.map((content, index) =>
                        <div key={content.id} style={{ borderColor: content.color }} className="border rounded-md ml-2 mr-2 mb-2 p-1">
                            <h2 style={{ color: content.color }} className="font-bold">
                                <Link to={`/courses/details/${courseIds[index]}`} className="hover:italic">
                                    {content.courseName}
                                </Link>
                            </h2>
                            <h3 style={{ color: content.color }}>
                                {content.moduleName?.includes("(weekend)")
                                    ? <>
                                        Weekend
                                    </>
                                    : <Link to={`/modules/details/${moduleIds[index]}`} className="hover:italic">
                                        {content.moduleName}
                                    </Link>
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
