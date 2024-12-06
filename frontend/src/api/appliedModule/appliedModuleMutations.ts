import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAppliedModule, updateAppliedModule } from "./appliedModuleFetches";
import { ModuleType } from "@models/module/Types";

export function useMutationPostAppliedModule() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return postAppliedModule(module);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedModules'] })
        }
    })

    return mutation;
}

export function useMutationUpdateAppliedModule() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return updateAppliedModule(module);
        },
        onSuccess: (_data, module) => {
            queryClient.invalidateQueries({ queryKey: ['appliedModules', module.id] })
        }
    })

    return mutation;
}