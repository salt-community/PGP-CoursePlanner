import { useMutation, useQuery, useQueryClient } from "react-query";
import { getModuleById, postModule } from "../api/ModuleApi";
import Page from "../components/Page";
import Module from "../components/module/Module";
import { getIdFromPath } from "../helpers/helperMethods";
import { ModuleType } from "../components/module/Types";
import { FormEvent } from "react";

export default function () {

    const moduleId = getIdFromPath();

    const { data: module, isLoading, isError } = useQuery({
        queryKey: ['modules', moduleId],
        queryFn: () => getModuleById(parseInt(moduleId))
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return postModule(module);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] })
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { moduleName } = e.target as typeof e.target & { moduleName: { value: string } };
        const { numberOfDays } = e.target as typeof e.target & { numberOfDays: { value: number } };

        const newModule: ModuleType = {
            name: moduleName.value,
            numberOfDays: numberOfDays.value,
            days: module!.days
        };

        mutation.mutate(newModule);
    }

    return (
        <Page>
            <Module module={module!} handleSubmit={handleSubmit}/>
        </Page>
    )
}