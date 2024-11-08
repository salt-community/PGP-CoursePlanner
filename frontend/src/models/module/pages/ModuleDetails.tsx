import { Link, useNavigate } from "react-router-dom";
import { deleteModule, getModuleById } from "../../../api/ModuleApi";
import Page from "../../../components/Page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIdFromPath } from "../../../helpers/helperHooks";
import { getAllCourses } from "../../../api/CourseApi";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";
import { trackUrl } from "../../../helpers/helperMethods";

export default function ModuleDetails() {
    trackUrl();

    const navigate = useNavigate();
    const moduleId = useIdFromPath();
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
        getCookie("access_token") == undefined
            ? <Login /> : <Page>
                {isLoading && <LoadingMessage />}
                {isError && <ErrorMessage />}
                {module && module.track &&
                    <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
                        <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                            <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                                <div className="flex flex-col items-center">
                                    <h1 className="pb-0 text-xl text-primary font-bold">{module.name}</h1>
                                    {module.track.length > 0
                                        ? <p className="pb-4 text-lg font-medium">Track: {module.track.join(', ')}</p>
                                        : <p className="pb-4 text-lg font-medium">Track: not selected</p>
                                    }
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
                            <button onClick={() => handleDelete(parseInt(moduleId))} className="btn btn-sm py-1 max-w-xs btn-error text-white">Delete Module</button>
                        </div>
                    </section>
                }
            </Page>
    )
}
