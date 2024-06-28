import { Link, useNavigate } from "react-router-dom";
import { deleteModule, getModuleById } from "../../api/ModuleApi";
import Page from "../../components/Page";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getIdFromPath } from "../../helpers/helperMethods";
import { getAllCourses } from "../../api/CourseApi";

export default function ModuleDetails() {
    const navigate = useNavigate();

    const moduleId = getIdFromPath();

    const { data: module, isLoading, isError } = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });

    const { data: allCourses } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getAllCourses()
    });
    const usedModules: number[] = [];
    if (allCourses) {
        allCourses.forEach(c => {
            c.moduleIds.forEach(element => {
                usedModules.push(element);
            });
        });
    }

    const queryClient = useQueryClient();

    const handleDelete = (id: number) => {
        if (!usedModules.find(m => m == id)) {
            mutation.mutate(id);
        }
        else {
            document.getElementById("invalid-module-delete")?.classList.remove("hidden");
            return;
        }
    }

    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteModule(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] })
            navigate(`/modules`);
        }
    })

    return (

        <Page>
            {isLoading && <p>Loading...</p>}
            {isError && <p>An error occured</p>}
            {module &&
                <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
                    <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                        <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                            <h1 className="pb-4 text-xl text-primary font-bold">{module.name}</h1>
                            {module.days.map((day, index) =>
                                <>
                                    <h1 className="text-lg text-black font-bold self-start">
                                        Day {day.dayNumber}: {day.description}
                                    </h1>
                                    <table className="table table-sm lg:table-lg" key={"day_" + index}>
                                        <thead>
                                            {day.events.length > 0 &&
                                                <tr>
                                                    <th className="text-sm w-1/6">Event</th>
                                                    <th className="text-sm w-1/2">Event description</th>
                                                    <th className="text-sm w-1/6">Start</th>
                                                    <th className="text-sm w-1/6">End</th>
                                                </tr>
                                            }
                                        </thead>
                                        <tbody>
                                            {day.events.length > 0 && day.events.map((event, eventIndex) =>
                                                <tr key={eventIndex}>
                                                    <td className="text-sm">{event.name}</td>
                                                    <td className="text-sm">{event.description}</td>
                                                    <td className="text-sm">{event.startTime}</td>
                                                    <td className="text-sm">{event.endTime}</td>
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
                        <button onClick={() => handleDelete(parseInt(moduleId))} className="btn btn-sm py-1 max-w-xs btn-error text-white">Delete Module</button>
                        <Link to={`/modules/edit/${moduleId}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit Module</Link>
                    </div>
                    <p className="error-message text-red-600 text-sm hidden" id="invalid-module-delete">Cannot delete this module, it is used in a course!</p>

                </section>
            }
        </Page>
    )
}