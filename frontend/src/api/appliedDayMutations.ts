import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAppliedDay } from "./appliedDayFetches";
import { DayType } from "@models/module/Types";

export function useMutationPostAppliedDay() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (dayType: DayType) => {
            return postAppliedDay(dayType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedModules'] })
        }
    })

    return mutation
}