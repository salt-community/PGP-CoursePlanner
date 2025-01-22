import Page from "@components/Page";
import { Link } from "react-router-dom";
import { useQueryModules } from "@api/module/moduleQueries";
import Header from "@components/Header";
import ErrorModal from "@components/ErrorModal";

export default function Modules() {
    const { data: modules, isError } = useQueryModules();

    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">Modules</h1>
            </Header>
            <section className="flex flex-wrap gap-6 p-10 pt-0">
                {modules &&
                    <Link to={"/modules/create"} className="flex items-center justify-center bg-primary rounded-xl hover:bg-[#EF4E72] hover:cursor-pointer drop-shadow-xl text-white min-h-72 min-w-72">
                        <div className="text-lg">
                            Create new module
                        </div>
                    </Link>}
                {modules && modules.map((module, index) =>
                    <Link to={`/modules/details/${module.id}`} key={module.name + index} className="flex items-center justify-center flex-col gap-2 relative hover:bg-[#F9F9F9] hover:cursor-pointer bg-white rounded-xl drop-shadow-xl min-h-72 min-w-72">
                        <h2 className="text-primary text-lg">{module.name}</h2>
                        <div className="flex gap-2">
                            {module.tracks.map((t) => {
                                return <h3 className="text-[#636363]" key={t.id}>{t.name}</h3>
                            })}
                        </div>
                        <h4 className="absolute text-[#636363] bottom-0 p-8">Creation Date: 2024-01-13</h4>
                    </Link>
                )}
            </section>
            {isError && <ErrorModal error="Modules" />}
        </Page>
    )
}