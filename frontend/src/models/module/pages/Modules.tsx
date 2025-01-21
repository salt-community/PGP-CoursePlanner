import Page from "@components/Page";
import { Link } from "react-router-dom";
import { useQueryModules } from "@api/module/moduleQueries";

export default function Modules() {
    const { data: modules } = useQueryModules();

    return (
        <Page>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-24 lg:px-56">
                {modules &&
                    <Link to={"/modules/create"} className="border border-primary bg-primary text-white pb-[100%] relative">
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            Create new module
                        </div>
                    </Link>}
                {modules && modules.map((module, index) =>
                    <Link to={`/modules/details/${module.id}`} key={module.name + index} className="border border-black pb-[100%] relative">
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
                            <h2 className="text-primary">{module.name}</h2>
                            <div className="flex gap-2">
                                {module.tracks.map((t) => {
                                    return <h3 className="text-sm" key={t.id}>{t.name}</h3>
                                })}
                            </div>
                        </div>
                    </Link>
                )}
            </section>
        </Page>
    )
}