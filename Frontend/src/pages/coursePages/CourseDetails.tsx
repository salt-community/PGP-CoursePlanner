import { Link, useNavigate } from "react-router-dom";
import { deleteCourse, getCourseById } from "../../api/CourseApi";
import Page from "../../components/Page";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getIdFromPath } from "../../helpers/helperMethods";

export default function CourseDetails() {
    const navigate = useNavigate();

    const courseId = getIdFromPath();

    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => getCourseById(parseInt(courseId))
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteCourse(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            navigate(`/courses`);
        }
    })

    return (

        <Page>
            {isLoading && <p>Loading...</p>}
            {isError && <p>An error occured</p>}
            {course &&
                <section className="w-11/12 mx-auto flex flex-col gap-4">
                    <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                        <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                            <h1 className="pb-4 text-xl text-primary font-bold">{course.name}</h1>
                            {course.modules.map((module, index) =>
                                <table className="table table-sm lg:table-lg" key={"module_" + index}>
                                    <thead>
                                        <tr className="text-lg">
                                            <th>{module.name} ({module.numberOfDays} days)</th>
                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                        {day.events.length > 0 &&
                                            <tr>
                                                <th className="text-sm w-1/3">Summary</th>
                                                <th className="text-sm w-1/3">Description</th>
                                                <th className="text-sm w-1/6">Start</th>
                                                <th className="text-sm w-1/6">End</th>
                                            </tr>
                                        }
                                        {day.events.length > 0 && day.events.map((event, eventIndex) =>
                                            <tr key={eventIndex}>
                                                <td className="text-sm w-1/3">{event.name}</td>
                                                <td className="text-sm w-1/3">{event.description}</td>
                                                <td className="text-sm w-1/6">{event.startTime}</td>
                                                <td className="text-sm w-1/6">{event.endTime}</td>
                                            </tr>
                                        )}
                                        <tr></tr>
                                    </tbody> */}
                                </table>
                            )}
                        </section>
                    </div>
                    <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                        <button onClick={() => mutation.mutate(parseInt(courseId))} className="btn btn-sm py-1 max-w-xs btn-error text-white">Delete Course</button>
                        <Link to={`/modules/edit/${courseId}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit Course</Link>
                    </div>
                </section>
            }
        </Page>
    )
}