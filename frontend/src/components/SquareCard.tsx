import { Track } from "@models/course/Types"
import LoadingSkeletonModule from "@models/module/components/LoadingSkeletonModule"
import { ModuleType } from "@models/module/Types"
import { Link } from "react-router-dom"

type Props = {
    data: ModuleType[] | Track[],
    isLoading: boolean,
    tracks?: boolean
}

export default function SquareCard({ data, isLoading, tracks }: Props) {
    return (
        <>
            {data && data.map((item, index) =>
                <Link to={`/${tracks ? "tracks" : "modules"}/details/${item.id}`} key={item.name + index} className={`flex items-center justify-center flex-col gap-2 relative ${isLoading ? "cursor-default pointer-events-none" : "hover:bg-[#F9F9F9]"} bg-white rounded-xl drop-shadow-xl min-h-72 min-w-72`}>
                    {isLoading ?
                        <LoadingSkeletonModule />
                        :
                        <>
                            {tracks ?
                                <div className="flex gap-2">
                                    <div className="p-2.5 m-1 mask rounded" style={{ backgroundColor: (item as Track).color }}></div>
                                    <h2 className="text-primary text-lg">
                                        {item.name}
                                    </h2>
                                </div>
                                :
                                <h2 className="text-primary text-lg">
                                    {item.name}
                                </h2>
                            }
                            {!tracks &&
                                <div className="flex gap-2 flex-wrap justify-center max-w-60">
                                    {(item as ModuleType).tracks.map((t) =>
                                        <div className="flex gap-2" key={t.id}>
                                            <div className="p-2.5 m-1 mask rounded" style={{ backgroundColor: (t as Track).color }}></div>
                                            <h3 className="text-lg text-[#636363]">
                                                {t.name}
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            }
                            <h4 className="absolute text-sm text-[#636363] bottom-0 mb-8">Creation Date: 2024-01-13</h4>
                        </>
                    }
                </Link>
            )}
        </>
    )
}