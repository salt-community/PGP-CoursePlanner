import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postTrack } from "./trackFetches";
import { TrackRequest } from "@api/Types";

export function useMutationPostTrack() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (track: TrackRequest) => {
            return postTrack(track);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tracks'] });
            navigate(`/tracks`);
        }
    });

    return mutation;
}