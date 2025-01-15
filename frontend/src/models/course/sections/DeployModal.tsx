import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { CourseModuleType, CourseType } from "../Types";
import { useMutationPostAppliedCourse, useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { useNavigate } from "react-router-dom";
import { useQueryAppliedCourses } from "@api/appliedCourse/appliedCourseQueries";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import MiniCalendar from "./MiniCalendar";
import { calculateCourseDayDates, getNewDate, moveModule, stripIdsFromCourse, updatePreviewCalendarDates } from "../helpers/courseUtils";
import EditCourseDays from "./EditCourseDays";


type Props = {
    course: CourseType,
}

export default function DeployModal({ course }: Props) {

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);

    const mutationPostAppliedCourse = useMutationPostAppliedCourse();
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();
    const navigate = useNavigate();

    const { data: appliedCourses, isLoading: isLoadingAppliedCourses, isError: isErrorAppliedCourses } = useQueryAppliedCourses();

    calculateCourseDayDates(course, startDate)
    const [previewCourse, setCourse] = useState<CourseType>(course);
    const [previewCalendarDays, setPreviewCalendarDays] = useState(updatePreviewCalendarDates(previewCourse))


    useEffect(() => {
        const updatedDays = updatePreviewCalendarDates(previewCourse);
        console.log("update days")
        console.log(previewCourse)
        setPreviewCalendarDays(updatedDays);
    }, [previewCourse, startDate]);


    const handleApplyTemplate = async () => {
        const myCourse = stripIdsFromCourse(previewCourse)

        console.log(myCourse)
        console.log(previewCourse)

        setIsInvalidDate(false);
        if (
            startDate.getDay() == 6 ||
            startDate.getDay() == 0
        ) {
            if (startDate.getDay() == 6 || startDate.getDay() == 0)
                setIsInvalidDate(true);
        } else {
            const appliedCoursesWithCourseId = appliedCourses!.filter(
                (m) => m.id! == course!.id
            );
            if (appliedCoursesWithCourseId.length > 0) {

                mutationUpdateAppliedCourse.mutate(myCourse);
            }


            mutationPostAppliedCourse.mutate(myCourse);
            navigate("/activecourses");
        }
    };



    return (
        <>
            {(isLoadingAppliedCourses) && (previewCourse) && (
                <LoadingMessage />
            )}
            {(isErrorAppliedCourses) && <ErrorMessage />}


            <dialog id="my_DeployModal_1" className="modal">
                <div className="modal-box flex flex-col h-[80vh] w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg">Choose a start date and deploy Bootcamp</h3>
                    <br />

                    <DatePicker
                        name="startDate"
                        value={startDate}
                        onChange={(date) => setStartDate(date!)}
                        sx={{
                            height: "35px",
                            padding: "0px",
                            "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                                fontFamily: "Montserrat",
                                color: "var(--fallback-bc,oklch(var(--bc)/0.7))",
                                padding: "6px",
                            },
                            "& .css-1yq5fb3-MuiButtonBase-root-MuiIconButton-root": {
                                color: "var(--fallback-bc,oklch(var(--bc)/0.7))",
                            },
                            "& .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
                                borderRadius: "var(--rounded-btn, 0.5rem)"
                            }
                        }}
                        className="input input-bordered"
                    />
                    {isInvalidDate && (
                        <p className="error-message text-red-600 text-sm" id="invalid-helper">
                            Please select a weekday for the start date
                        </p>
                    )}
                    <br />
                    <section className="flex flex-grow">

                        <div className="flex-grow overflow-auto">
                            <MiniCalendar startDate={startDate} previewCalendarDays={previewCalendarDays} />
                        </div>
                        <div >
                            <EditCourseDays course={previewCourse} setCourse={setCourse} />
                        </div>
                    </section>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-5 justify-center">
                            <button className="btn">Cancel</button>
                            <button className="btn btn-primary" onClick={handleApplyTemplate}>Deploy Bootcamp</button>
                            <button className="btn" onClick={(event) => {
                                event.preventDefault();
                                const updatedModules: CourseModuleType[] = previewCourse.modules.map((m, index) =>
                                    index === 0
                                        ? { ...m, module: moveModule(m.module, getNewDate(new Date(), -2)) }
                                        : m
                                );
                                setCourse({ ...previewCourse, modules: updatedModules });
                            }}>test moveModule</button>

                        </form>
                    </div>
                </div>
            </dialog>

        </>
    )
}