import { getAllModules } from "../../../api/ModuleApi";
import Page from "../../../components/Page";
import { Link } from "react-router-dom";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";
import { useQuery } from "@tanstack/react-query";
import FilterArea from "../../course/sections/FilterArea";
import { useEffect, useState } from "react";
import { ModuleType } from "../Types";

export default function Modules() {
    const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);

    const { data: modules, isLoading, isError } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });
    useEffect(() => {
        if (modules) {
            setFilteredModules(modules);
        }
    }, [modules]);

    async function funcFilter(formData: FormData) {
        const inputTrack = formData.get('track') as string;
        if (inputTrack) {
            if (inputTrack == "All") {
                setFilteredModules(modules!)
            }
            else {
                const selectedModules = modules!.filter(m => m.track?.includes(inputTrack));
                setFilteredModules(selectedModules);
            }
        } else {
            console.log("No track selected.");
        }
    }

    const tracks: string[] = [];
    for (let trackArray of modules!.filter(m => m.track!).map(m => m.track!)) {
        trackArray.forEach(track => {
            if (!tracks.find(t => t == track)) {
                tracks.push(track);
            }
        });
    }

    return (
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                <div className="mx-28 mb-10 md:px-24 lg:px-56">
                    {modules &&
                        <FilterArea modules={modules} options={tracks} funcFilter={funcFilter} funcResetFilter={() => { }}></FilterArea>}
                </div>
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-24 lg:px-56">
                    {isLoading && <LoadingMessage />}
                    {isError && <ErrorMessage />}
                    {modules &&
                        <Link to={"/modules/create"} className="border border-primary bg-primary text-white pb-[100%] relative">
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                                Create new module
                            </div>
                        </Link>}
                    {filteredModules && filteredModules.map((module, index) =>
                        <Link to={`/modules/details/${module.id}`} key={module.name + index} className="border border-black pb-[100%] relative">
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
                                <h1 className="text-primary">{module.name}</h1>
                                {module.track && <h1>{module.track.join(', ')}</h1>}
                            </div>
                        </Link>
                    )}
                </section>
            </Page>
    )
}