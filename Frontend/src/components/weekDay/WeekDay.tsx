import { DateContent } from "../calendar/Types";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllModules } from "../../api/ModuleApi";
import { getAllCourses } from "../../api/CourseApi";

type Props = {
    dateContent: DateContent[] | undefined
}

export default function WeekDay({ dateContent }: Props) {

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
        <div className={`rounded-lg flex flex-col justify-start w-full h-full`}>
            {dateContent && dateContent.map((content, index) =>
                <div style={{ borderColor: content.color }} className="rounded-lg ml-2 mr-2 mb-2 p-2">
                    <h2 style={{ color: content.color }} className="font-bold">
                        <Link to={`/courses/details/${courseIds[index]}`}>
                            {content.courseName}
                        </Link>
                    </h2>
                    <h3 style={{ color: content.color }}>
                        <Link to={`/modules/details/${moduleIds[index]}`}>
                            Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                        </Link>
                    </h3>
                    {content.events.length > 0 && content.events.map(eventItem =>
                        <h3 style={{ color: content.color }}>{eventItem.name}: {eventItem.startTime}-{eventItem.endTime}</h3>
                    )}
                </div>
            )}
        </div>
    )
}
