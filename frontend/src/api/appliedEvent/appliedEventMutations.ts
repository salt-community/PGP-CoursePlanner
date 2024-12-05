import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAppliedEvent } from "./appliedEventFetches";
import { EventType } from "@models/module/Types";

export function useMutationPostAppliedEvent() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (newEvent: EventType) => {
            return postAppliedEvent(newEvent);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedModules'] })
        }
    })

    return mutation;
}