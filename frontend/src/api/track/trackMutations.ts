import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTrack } from "./trackFetches";
import { TrackRequest } from "@api/Types";

export function useMutationPostTrack() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (track: TrackRequest) => {
            return postTrack(track);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tracks'] });
            window.location.reload()
        },
        retry: 1
    });

    return mutation;
}