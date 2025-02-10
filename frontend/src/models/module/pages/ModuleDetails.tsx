import { Link } from "react-router-dom";
import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useQueryCourses } from "@api/course/courseQueries";
import { useQueryModuleById } from "@api/module/moduleQueries";
import { useMutationDeleteModule } from "@api/module/moduleMutations";
import ErrorModal from "@components/ErrorModal";
import Header from "@components/Header";
import LoadingSpinner from "@models/course/components/LoadingSpinner";
import ModuleOverview from "@models/course/sections/ModuleOverview";

export default function ModuleDetails() {
    const moduleId = useIdFromPath();
    const { data: module, isLoading, isError } = useQueryModuleById(moduleId);
    const { data: courses } = useQueryCourses();
    const mutation = useMutationDeleteModule();

    const usedModules: number[] = [];
    if (courses) {
        courses.forEach(c => {
            c.moduleIds!.forEach(element => {
                usedModules.push(element);
            });
        });
    }

    const handleDelete = (id: number) => {
        mutation.mutate(id);
        document.getElementById("invalid-module-delete")?.classList.remove("hidden");
    }

    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">
                    Module Template
                </h1>
            </Header>
            <section className="grid grid-rows-[145px_1fr] grid-cols-9 bg-white m-5 mt-0 rounded-lg h-full overflow-auto drop-shadow-xl">
                {/* Second Row, Second Column */}
                <div className="row-span-7 col-span-7 p-10 pt-0 overflow-auto">
                    {module &&
                        <ModuleOverview module={module} />
                    }
                    {isLoading && <LoadingSpinner />}
                </div>
            </section>
            {module &&
                <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
                    <p className="error-message text-red-600 text-sm hidden" id="invalid-module-delete">Cannot delete this module, it is used in a course!</p>
                    <div className="pt-4 mb-4 flex gap-4 flex-col sm:flex-row">
                        <Link to={`/modules/edit/${moduleId}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit Module</Link>
                        <button onClick={() => handleDelete(moduleId)} className="btn btn-sm py-1 max-w-xs btn-error text-white">Delete Module</button>
                    </div>
                </section>
            }
            {isError && <ErrorModal error="Module" />}
        </Page>
    )
}
