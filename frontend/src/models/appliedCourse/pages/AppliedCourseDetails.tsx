import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useState } from "react";
import 'reactjs-popup/dist/index.css';
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationDeleteAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import Header from "@components/Header";
import CourseSection from "@models/course/sections/CourseSection";
import ErrorModal from "@components/ErrorModal";
import DeleteWarningModal from "@components/DeleteWarningModal";

export default function AppliedCourseDetails() {
    const [openModal, setOpenModal] = useState(false);
    const appliedCourseId = useIdFromPath();
    const { data: appliedCourse, isLoading: isLoadingAppliedCourse, isError: isErrorAppliedCourse } = useQueryAppliedCourseById(appliedCourseId);
    const mutationDeleteAppliedCourse = useMutationDeleteAppliedCourse();

    function handleDeleteCourse() {
        mutationDeleteAppliedCourse.mutate(appliedCourseId);
        if (mutationDeleteAppliedCourse.isSuccess) {
            setOpenModal(false);
        }
    }

    return (
        <Page>
            <Header>
                <h1 className="text-3xl font-semibold">
                    Bootcamp
                </h1>
            </Header>
            <CourseSection setOpenModal={setOpenModal} course={appliedCourse} isLoading={isLoadingAppliedCourse} />
            {appliedCourse &&
                <DeleteWarningModal openModal={openModal} setOpenModal={setOpenModal} warning={`${appliedCourse.name} Course Template`} handleDelete={handleDeleteCourse} isError={mutationDeleteAppliedCourse.isError} errorMessage={mutationDeleteAppliedCourse.error?.message} resetMutation={mutationDeleteAppliedCourse.reset} />
            }
            {isErrorAppliedCourse &&
                <ErrorModal error="Course Template" />
            }
        </Page >
    )
}