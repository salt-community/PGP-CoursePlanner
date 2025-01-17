import { useQuery } from "@tanstack/react-query";
import { getTracks } from "./trackFetches";
import { Track } from "@models/course/Types";

export function useQueryTracks() {
    const { data, isLoading, isError } = useQuery<Track[]>({
        queryKey: ['tracks'],
        queryFn: getTracks
    });
    // console.log("Tracks:", data);

    return { data, isLoading, isError };
}