import { Link, useLocation } from "react-router-dom";
import { getModuleById } from "../api/ModuleApi";
import Page from "../components/Page";
import { useQuery } from "react-query";
import { getIdFromPath } from "../helpers/helperMethods";

export default function ModuleDetails() {

    const moduleId = getIdFromPath();
    
    const { data: module, isLoading, isError } = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });


    return (

        <Page>
            {isLoading && <p>Loading...</p>}
            {isError && <p>An error occured</p>}
            {/* {module && module.name} */}

            <section className="w-11/12 mx-auto flex flex-col gap-4">
                <h1 className="pb-4">{module!.name}</h1>
                <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
                    <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                        {module && module.days.map((day, index) => {
                            return (
                                <table className="table  table-sm" key={"day_" + index}>
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>{day.dayNumber}</th>
                                        </tr>
                                        <tr>
                                            <th className="w-1/4">Summary</th>
                                            <th className="w-1/4">Description</th>
                                            <th className="w-1/4">Start</th>
                                            <th className="w-1/4">End</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {day.events.length > 0 && day.events.map((event, eventIndex) =>
                                            <tr key={eventIndex}>
                                                <td className="w-1/4">{event.name}</td>
                                                <td className="w-1/4">{event.description}</td>
                                                <td className="w-1/4">{event.startTime}</td>
                                                <td className="w-1/4">{event.endTime}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )
                        })
                        }
                    </section>
                </div>
                <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                    <button className="btn btn-sm py-1 max-w-xs btn-error text-white">Delete Module </button>
                    <Link to={`/modules/edit/${module!.id}`} className="btn btn-sm py-1 max-w-xs btn-info text-white"> Edit Module </Link>
                </div>
            </section>
        </Page>
    )
}