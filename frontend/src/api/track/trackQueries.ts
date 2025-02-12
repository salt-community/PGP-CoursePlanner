import { useQuery } from "@tanstack/react-query";
import { getTracks } from "./trackFetches";
import { Track } from "@api/Types";
import { useState } from "react";

export function useQueryTracks() {
    const { data, isLoading, isError, isFetching } = useQuery<Track[]>({
        queryKey: ['tracks'],
        queryFn: getTracks
    });

        const [delayedLoading, setDelayedLoading] = useState(isLoading);
        if (!isLoading) {
            setTimeout(() => {
                setDelayedLoading(isLoading);
            }, 500)
        }

    return { data, isLoading: delayedLoading, isError, isFetching };
}