import { Link, useNavigate } from "react-router-dom";
import { deleteCourse, getCourseById } from "../../api/CourseApi";
import Page from "../../components/Page";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getIdFromPath } from "../../helpers/helperMethods";
import { ModuleType } from "../../components/module/Types";
import { getAllModules } from "../../api/ModuleApi";

export default function CourseDetails() {
    const navigate = useNavigate();

    const courseId = getIdFromPath();

    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => getCourseById(parseInt(courseId))
    });

    const { data: allModules } = useQuery({
        queryKey: ['modules'],
        queryFn: () => getAllModules()
    });

    var modules: ModuleType[] = [];
    course?.moduleIds.forEach(element => {
        var module = allModules?.find(m => m.id == element);
        modules.push(module!)
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
                <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
                    <div className="">
                        <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                            <h1 className="pb-4 text-xl text-primary font-bold">{course.name}</h1>
                            {modules.map((module, index) =>
                                <>
                                    <h1 className="text-lg text-black font-bold self-start">
                                        <Link to={`/modules/details/${module.id}`}>
                                            Module {index + 1}: {module.name}
                                        </Link>
                                    </h1>
                                    <table className="table table-fixed table-sm lg:table-lg" key={"module_" + index}>
                                        <thead>
                                            <tr>
                                                <th className="text-sm w-1/6">Day</th>
                                                <th className="text-sm w-1/6">Events</th>
                                                <th className="text-sm w-2/3">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {module.days.map((day, dayIndex) =>
                                                <tr key={dayIndex}>
                                                    <td className="text-sm">{day.dayNumber}</td>
                                                    <td className="text-sm">{day.events.length}</td>
                                                    <td className="text-sm">{day.description}</td>
                                                </tr>
                                            )}
                                            <tr></tr>
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </section>
                    </div>
                    <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                        <button onClick={() => mutation.mutate(parseInt(courseId))} className="btn btn-sm py-1 w-48 btn-error text-white">Delete Course</button>
                        <Link to={`/courses/edit/${courseId}`} className="btn btn-sm py-1 w-48 btn-info text-white">Edit Course</Link>
                    </div>
                </section >
            }
        </Page >
    )
}