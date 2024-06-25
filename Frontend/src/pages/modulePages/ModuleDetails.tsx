import { Link, useNavigate } from "react-router-dom";
import { deleteModule, getModuleById } from "../../api/ModuleApi";
import Page from "../../components/Page";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getIdFromPath } from "../../helpers/helperMethods";

export default function ModuleDetails() {
    const navigate = useNavigate();

    const moduleId = getIdFromPath();

    const { data: module, isLoading, isError } = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });

    const queryClient = useQueryClient();

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
                <section className="w-11/12 mx-auto flex flex-col gap-4">
                    <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                        <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                            <h1 className="pb-4 text-xl text-primary font-bold">{module.name}</h1>
                            {module.days.map((day, index) =>
                                <table className="table table-sm lg:table-lg" key={"day_" + index}>
                                    <thead>
                                        <tr className="text-lg">
                                            <th>Day {day.dayNumber}: {day.description}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {day.events.length > 0 &&
                                            <tr>
                                                <th className="text-sm w-1/3">Event summary</th>
                                                <th className="text-sm w-1/3">Event description</th>
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
                                    </tbody>
                                </table>
                            )}
                        </section>
                    </div>
                    <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                        <button onClick={() => mutation.mutate(parseInt(moduleId))} className="btn btn-sm py-1 max-w-xs btn-error text-white">Delete Module</button>
                        <Link to={`/modules/edit/${moduleId}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit Module</Link>
                    </div>
                </section>
            }
        </Page>
    )
}