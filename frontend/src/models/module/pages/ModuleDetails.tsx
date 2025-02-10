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
import DeleteBtn from "@components/buttons/DeleteBtn";
import { useState } from "react";
import DeleteWarningModal from "@components/DeleteWarningModal";

export default function ModuleDetails() {
    const [openModal, setOpenModal] = useState(false);
    const moduleId = useIdFromPath();
    const { data: module, isLoading, isError } = useQueryModuleById(moduleId);
    const { data: courses } = useQueryCourses();
    const mutationDeleteModule = useMutationDeleteModule();

    const usedModules: number[] = [];
    if (courses) {
        courses.forEach(c => {
            c.moduleIds!.forEach(element => {
                usedModules.push(element);
            });
        });
    }

    function handleDeleteModule() {
        mutationDeleteModule.mutate(moduleId);
        if (mutationDeleteModule.isSuccess) {
            setOpenModal(false);
        }
    }

    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">
                    Module Template
                </h1>
            </Header>
            <section className="grid grid-rows-[145px_1fr] grid-cols-9 bg-white m-5 mt-0 rounded-lg h-full overflow-auto drop-shadow-xl p-10 pb-0">
                {/* First Row, First Column */}
                <div className="row-span-8 col-span-7 p-10 pt-0 overflow-auto">
                    {module &&
                        <ModuleOverview module={module} />
                    }
                    {isLoading && <LoadingSpinner />}
                </div>

                {/* First Row, Second Column */}
                <div className="row-span-8 col-span-2 p-10 pt-20 px-0">
                    {module &&
                        <>
                            <h3 className="text-2xl text-[#636363] text-center p-4">Tracks</h3>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex flex-col gap-2">
                                    {module.tracks.map((track, trackIndex) =>
                                        <div className="flex border rounded-full px-4 py-2 gap-1" key={trackIndex}>
                                            <div className="p-2.5 m-1 mask rounded" style={{ backgroundColor: track.color }}></div>
                                            <p className="text-lg text-[#636363]">{track.name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    }
                    {isLoading && <LoadingSpinner />}
                </div>

                {/* Second Row */}
                <div className="row-span-1 col-span-9 flex p-8 justify-between">
                    {module &&
                        <div className="flex gap-4">
                            <Link to={`/modules/edit/${moduleId}`} className="btn btn-secondary min-w-52 text-xl">Edit Module</Link>
                            <DeleteBtn onClick={() => setOpenModal(true)} />
                        </div>
                    }
                </div>
            </section>
            {module &&
                <DeleteWarningModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    warning={`${module.name} Module Template`}
                    handleDelete={handleDeleteModule}
                    isError={mutationDeleteModule.isError}
                    errorMessage={mutationDeleteModule.error?.message}
                    resetMutation={mutationDeleteModule.reset} />
            }
            {isError && <ErrorModal error="Module" />}
        </Page>
    )
}
