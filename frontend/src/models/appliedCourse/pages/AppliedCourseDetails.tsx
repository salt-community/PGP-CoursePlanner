import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import 'reactjs-popup/dist/index.css';
import PDFWeekGenerator from "../sections/PDFWeekGenerator";
import PDFGenerator from "../sections/PDFGenerator";
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationDeleteAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import Header from "@components/Header";
import CourseSection from "@models/course/sections/CourseSection";
import ErrorModal from "@components/ErrorModal";
import DeleteWarningModal from "@components/DeleteWarningModal";
import { useQueryModulesByCourseId } from "@api/course/courseQueries";

const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AppliedCourseDetails() {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [openModal, setOpenModal] = useState(false);
    const appliedCourseId = useIdFromPath();
    const { data: courseModules } = useQueryModulesByCourseId(appliedCourseId);
    const { data: appliedCourse, isLoading: isLoadingAppliedCourse, isError: isErrorAppliedCourse } = useQueryAppliedCourseById(appliedCourseId);
    const mutationDeleteAppliedCourse = useMutationDeleteAppliedCourse();

    useEffect(() => {
        if (appliedCourse) {
            setStartDate(new Date(appliedCourse.startDate));
        }
    }, [appliedCourse]);

    function getWeekDayList() {
        const days = [];
        const start = new Date(startDate);

        for (let current = new Date(start); ; current.setDate(current.getDate() + 1)) {
            const day = current.getDay();

            if (day !== 0 && day !== 6) {
                days.push(new Date(current));
            }

            if (days.length >= 360) {
                break;
            }
        }

        return days;
    }

    const courseWeekDates = getWeekDayList();
    const courseWeekDays = courseWeekDates.map(e => monthNamesShort[e.getMonth()] + " " + e.getDate().toString());

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
                    Course Template
                </h1>
            </Header>
            <CourseSection setOpenModal={setOpenModal} course={appliedCourse} isLoading={isLoadingAppliedCourse} />
            {(appliedCourse && courseModules) &&
                <>
                    <PDFGenerator appliedCourse={appliedCourse} courseWeekDays={courseWeekDays} appliedModules={courseModules}></PDFGenerator>
                    <PDFWeekGenerator appliedCourse={appliedCourse} courseWeekDays={courseWeekDays} appliedModules={courseModules}></PDFWeekGenerator>
                </>
            }
            {appliedCourse &&
                <DeleteWarningModal openModal={openModal} setOpenModal={setOpenModal} warning={`${appliedCourse.name} Course Template`} handleDelete={handleDeleteCourse} isError={mutationDeleteAppliedCourse.isError} errorMessage={mutationDeleteAppliedCourse.error?.message} resetMutation={mutationDeleteAppliedCourse.reset} />
            }
            {isErrorAppliedCourse &&
                <ErrorModal error="Course Template" />
            }
        </Page >
    )
}