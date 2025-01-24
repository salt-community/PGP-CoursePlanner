import { useQueryTracks } from "@api/track/trackQueries";
import ErrorModal from "@components/ErrorModal";
import Header from "@components/Header";
import Page from "@components/Page";
import SquareCard from "@components/SquareCard";
import LoadingSkeletonModule from "@models/module/components/LoadingSkeletonModule";
import { Link } from "react-router-dom";

export default function Track() {
    const { data: tracks, isLoading, isError } = useQueryTracks();
    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">Track Templates</h1>
            </Header>
            <section className="flex flex-wrap gap-6 p-10 pt-0">
                <Link to={"/tracks/create"} className="flex items-center justify-center bg-primary rounded-xl hover:bg-[#EF4E72] drop-shadow-xl text-white min-h-72 min-w-72">
                    <div className="text-lg">
                        Create new track
                    </div>
                </Link>
                {tracks && <SquareCard data={tracks} isLoading={isLoading} tracks={true} />}
                {(!tracks && isLoading) &&
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
            {isError && <ErrorModal error="Tracks" />}
        </Page>
    )
}