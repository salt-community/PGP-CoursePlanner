import { useQueryTracks } from "@api/track/trackQueries";
import ErrorModal from "@components/ErrorModal";
import Header from "@components/Header";
import Page from "@components/Page";
import SquareCard from "@components/SquareCard";
import LoadingSkeletonModule from "@models/module/components/LoadingSkeletonModule";
import CreateUpdateTrackModal from "../components/CreateUpdateTrackModal";
import { useState } from "react";
import { useMutationPostTrack } from "@api/track/trackMutations";

export default function Track() {
    const [openModal, setOpenModal] = useState(false);
    const { data: tracks, isLoading, isError } = useQueryTracks();
    const mutationPostTrack = useMutationPostTrack();

    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">
                    Track Templates
                </h1>
            </Header>
            <section className="flex flex-wrap gap-6 p-10 pt-0">
                <button onClick={() => setOpenModal(true)} className="flex items-center justify-center bg-primary rounded-xl hover:bg-[#EF4E72] drop-shadow-xl text-white min-h-72 min-w-72">
                    <div className="text-lg">
                        Create new track
                    </div>
                </button>
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
            {openModal && <CreateUpdateTrackModal openModal={openModal} setOpenModal={setOpenModal} mutation={mutationPostTrack} />}
            {(isError) && <ErrorModal error="Tracks" />}
        </Page>
    )
}