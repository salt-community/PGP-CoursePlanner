import { useQuery } from "@tanstack/react-query";
import { getTracks } from "./trackFetches";
import { TrackType } from "@api/Types";

export function useQueryTracks() {
    const { data, isLoading, isError } = useQuery<TrackType[]>({
        queryKey: ['tracks'],
        queryFn: getTracks
    });

    return { data, isLoading, isError };
}