import { useMutation, useQueryClient } from "react-query";
import Page from "../components/Page";
import Module from "../components/module/Module";
import { postModule } from "../api/ModuleApi";
import { ModuleType } from "../components/module/Types";
import { FormEvent } from "react";

export default function CreateModule() {

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

        const module: ModuleType = {
            name: moduleName.value,
            numberOfDays: numberOfDays.value,
            days: daysOfModule
        };

        mutation.mutate(module);
    }
    
    return (
        <Page>
            <Module />
        </Page>
    )
}