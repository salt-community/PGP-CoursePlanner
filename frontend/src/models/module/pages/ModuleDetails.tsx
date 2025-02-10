import { Link } from "react-router-dom";
import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useQueryCourses } from "@api/course/courseQueries";
import { useQueryModuleById } from "@api/module/moduleQueries";
import { useMutationDeleteModule } from "@api/module/moduleMutations";
import ErrorModal from "@components/ErrorModal";

export default function ModuleDetails() {
    const moduleId = useIdFromPath();
    const { data: module, isLoading, isError } = useQueryModuleById(moduleId);
    const { data: courses } = useQueryCourses();
    const mutation = useMutationDeleteModule();

    const usedModules: number[] = [];
    if (courses) {
        courses.forEach(c => {
            c.moduleIds!.forEach(element => {
                usedModules.push(element);
            });
        });
    }

    const handleDelete = (id: number) => {
        mutation.mutate(id);
        document.getElementById("invalid-module-delete")?.classList.remove("hidden");
    }

    return (
        <Page>
            {module &&
                <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
                    <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                        <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                            <div className="flex flex-col items-center">
                                <h1 className="pb-0 text-xl text-primary font-bold">{module.name}</h1>
                            </div>
                            {module.days.map((day) =>
                                <div className="w-full" key={"day_" + day.dayNumber}>
                                    <h2 className="text-lg  font-bold self-start">
                                        Day {day.dayNumber}: {day.description}
                                    </h2>
                                    <table className="table table-sm lg:table-lg">
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
                                                    {event.startTime[0] == "0"
                                                        ? <td className="text-sm">{event.startTime.slice(1)}</td>
                                                        : <td className="text-sm">{event.startTime}</td>
                                                    }
                                                    {event.endTime[0] == "0"
                                                        ? <td className="text-sm">{event.endTime.slice(1)}</td>
                                                        : <td className="text-sm">{event.endTime}</td>
                                                    }
                                                </tr>
                                            )}
                                            <tr></tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                    <p className="error-message text-red-600 text-sm hidden" id="invalid-module-delete">Cannot delete this module, it is used in a course!</p>
                    <div className="pt-4 mb-4 flex gap-4 flex-col sm:flex-row">
                        <Link to={`/modules/edit/${moduleId}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit Module</Link>
                        <button onClick={() => handleDelete(moduleId)} className="btn btn-sm py-1 max-w-xs btn-error text-white">Delete Module</button>
                    </div>
                </section>
            }
            {isError && <ErrorModal error="Module" />}
        </Page>
    )
}
