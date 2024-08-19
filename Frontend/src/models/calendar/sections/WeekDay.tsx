import { DateContent } from "../Types";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "../../../api/CourseApi";
import { getAllModules } from "../../../api/ModuleApi";

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
                <div key={content.id} style={{ borderColor: content.color }} className="border rounded-md ml-2 mr-2 mb-2 p-2">
                    <h2 style={{ color: content.color }} className="font-bold">
                        <Link to={`/courses/details/${courseIds[index]}`}>
                            {content.courseName}
                        </Link>
                    </h2>
                    <h3 style={{ color: content.color }}>
                        {content.moduleName?.includes("(weekend)")
                            ? <>
                                Weekend
                            </>
                            : <Link to={`/modules/details/${moduleIds[index]}`}>
                                Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                            </Link>
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
