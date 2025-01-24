import Page from "@components/Page";
import { Link } from "react-router-dom";
import { useQueryModules } from "@api/module/moduleQueries";
import Header from "@components/Header";
import ErrorModal from "@components/ErrorModal";
import LoadingSkeletonModule from "../components/LoadingSkeletonModule";
import SquareCard from "@components/SquareCard";

export default function Modules() {
    const { data: modules, isLoading, isError } = useQueryModules();

    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">
                    Module Templates
                </h1>
            </Header>
            <section className="flex flex-wrap gap-6 p-10 pt-0">
                <Link to={"/modules/create"} className="flex items-center justify-center bg-primary rounded-xl hover:bg-[#EF4E72] drop-shadow-xl text-white min-h-72 min-w-72">
                    <div className="text-lg">
                        Create new module
                    </div>
                </Link>
                {modules && <SquareCard data={modules} isLoading={isLoading} />}
                {(!modules && isLoading) &&
                    <>
                        <div className={`flex items-center justify-center flex-col gap-2 relative bg-white rounded-xl drop-shadow-xl min-h-72 min-w-72`}>
                            <LoadingSkeletonModule />
                        </div>
                        <div className={`flex items-center justify-center flex-col gap-2 relative bg-white rounded-xl drop-shadow-xl min-h-72 min-w-72`}>
                            <LoadingSkeletonModule />
                        </div>
                        <div className={`flex items-center justify-center flex-col gap-2 relative bg-white rounded-xl drop-shadow-xl min-h-72 min-w-72`}>
                            <LoadingSkeletonModule />
                        </div>
                    </>
                }
            </section>
            {isError && <ErrorModal error="Modules" />}
        </Page>
    )
}