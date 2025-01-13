import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { CourseType } from "../Types";
import { useMutationPostAppliedCourse, useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { useNavigate } from "react-router-dom";
import { useQueryAppliedCourses } from "@api/appliedCourse/appliedCourseQueries";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import MiniCalendar from "./MiniCalendar";
import { ModuleType } from "@models/module/Types";
import { moveDay, stripIdsFromCourse } from "../helpers/courseUtils";

type Props = {
    course: CourseType,
    modules : ModuleType[]
}

export default function DeployModal({ course, modules }: Props) {

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);

    const mutationPostAppliedCourse = useMutationPostAppliedCourse();
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();
    const navigate = useNavigate();

    const { data: appliedCourses, isLoading: isLoadingAppliedCourses, isError: isErrorAppliedCourses } = useQueryAppliedCourses();


    const handleApplyTemplate = async () => {

 

        const myCourse = stripIdsFromCourse(course)

        console.log(myCourse)
        console.log(course)

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

    const startDatePlus2 = new Date(startDate)
    startDatePlus2.setDate(startDatePlus2.getDate() +2)

    // moveDay(startDate, startDatePlus2, course, false)

    return (
        <>
            {(isLoadingAppliedCourses) && (
                <LoadingMessage />
            )}
            {(  isErrorAppliedCourses) && <ErrorMessage />}


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
                    <div className="flex-grow overflow-auto">
                        <MiniCalendar startDate={startDate} course={course} modules={modules} />
                    </div>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-5 justify-center">
                            <button className="btn">Cancel</button>
                            <button className="btn btn-primary" onClick={handleApplyTemplate}>Deploy Bootcamp</button>
                            <button className="btn" onClick={() => moveDay(startDate, startDatePlus2, course, false)}> scrobble</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </>
    )
}