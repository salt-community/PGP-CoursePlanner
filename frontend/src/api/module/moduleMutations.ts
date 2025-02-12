import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteModule, postModule, updateModule } from "./moduleFetches";
import { ModuleType } from "@api/Types";

export function useMutationPostModule() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return postModule(module);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            navigate(`/modules`);
        },
        retry: 1
    });

    return mutation;
}

export function useMutationUpdateModule(navigateTo?: string) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return updateModule(module);
        },
        onSuccess: (_data, module) => {
            queryClient.invalidateQueries({ queryKey: ['modules', module.id] });
            if (navigateTo) navigate(navigateTo);
        },
        retry: 1
    });

    return mutation;
}

export function useMutationDeleteModule() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteModule(id);
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ['modules', id] })
            navigate(`/modules`);
        },
        onError: (error) => {
            if (error.message === "401") {
                navigate(`/courses`);
            }
        },
        retry: 1
    })

    return mutation;
}