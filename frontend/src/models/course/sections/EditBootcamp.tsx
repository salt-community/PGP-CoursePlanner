import { useMutationPostAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { updatePreviewCalendarDates, getGoogleEventListForCourse, moveModule, getCourseWithDates, detectOverlappingDays, handleApplyTemplate } from "../helpers/courseUtils";
import { CourseType, ModuleType, CourseModuleType, DayType } from "../Types";
import { InfoPanel } from "./InfoPanel";
import MiniCalendar from "./MiniCalendar";
import { EditCourseDays } from "@models/appliedCourse/sections/EditCourseDays";
import { CalendarDateType } from "@models/calendar/Types";
import { postCourseToGoogle } from "@api/googleCalendar/googleCalendarFetches";

type Props = {
    course: CourseType,
}

type Inputs = {
    isDeployingToGoogle: boolean;
    groupEmail: string;
};




export function EditBootcamp({ course }: Props) {
    const [startDate, setStartDate] = useState<Date>(new Date());
    // const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const [overlappingDays, setOverlappingDays] = useState<DayType[]>([]);
    const mutationPostAppliedCourse = useMutationPostAppliedCourse();

    const navigate = useNavigate();

    if (startDate !== course.startDate && course.isApplied) {
        console.log("startdate: ", startDate, "course startdate:", course.startDate)
        setStartDate(course.startDate);
    }

    let courseWithDates = null
    if (course.isApplied) {
        courseWithDates = course
    } else {
        courseWithDates = getCourseWithDates(course, startDate)
    }

    const [previewCourse, setCourse] = useState<CourseType>(courseWithDates);
    const [previewCalendarDays, setPreviewCalendarDays] = useState(updatePreviewCalendarDates(previewCourse))

    // const [selectedModule, setSelectedModule] = useState<ModuleType>(previewCourse.modules[0].module);
    const [selectedModule, setSelectedModule] = useState<ModuleType>(previewCourse.modules[0].module);

    const [selectedDate, setSelectedDate] = useState<CalendarDateType>({ date: (new Date()), dateContent: [] })

    const [toggle, setToggle] = useState<string>("info")


    useEffect(() => {
        console.log("update", previewCourse)
        const updatedDays = updatePreviewCalendarDates(previewCourse);
        setPreviewCalendarDays(updatedDays);
        setOverlappingDays(detectOverlappingDays(previewCourse))
    }, [previewCourse, startDate]);


    const {
        register,
        handleSubmit,
        watch,
        // formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        if (data.isDeployingToGoogle) {
            const events = getGoogleEventListForCourse(previewCourse, "")
            postCourseToGoogle(events);
        }

        handleApplyTemplate(previewCourse, navigate, mutationPostAppliedCourse)
    }




    const handleMoveModule = () => {
        const newModule = moveModule(selectedModule, selectedDate.date)
        const updatedModules: CourseModuleType[] = previewCourse.modules.map((m) =>
            m.module.id == selectedModule.id
                ? { ...m, module: newModule }
                : m
        );
        setCourse({ ...previewCourse, modules: updatedModules });
        setSelectedModule(newModule)
    }


    return (
        <>
            <div className="flex flex-col h-[80vh] max-w-full">
                <br />
                <section className="flex flex-grow gap-1">

                    <div className="flex-grow overflow-auto">
                        <MiniCalendar previewCourse={previewCourse} startDate={startDate} previewCalendarDays={previewCalendarDays} selectedModule={selectedModule} selectedModuleStartDate={selectedDate} setSelectedModuleStartDate={setSelectedDate} setSelectedModule={setSelectedModule} />
                    </div>
                    <div className="flex flex-col w-2/5">
                        <div className="flex">
                            <button className="btn w-1/3" onClick={() => setToggle("info")}>Info</button>
                            <button className="btn w-1/3" onClick={() => setToggle("edit")}>Edit</button>
                            <button className="btn w-1/3">Nothing</button>
                        </div>
                        {overlappingDays.length > 0 && <p className="text-red-600">you have overlapping days!</p> }
                        {toggle == "info" && <InfoPanel selectedModule={selectedModule} selectedDate={selectedDate} handleMoveModule={handleMoveModule} />}
                        {toggle == "edit" && <EditCourseDays appliedCourse={course} course={previewCourse} setCourse={setCourse} />}
                    </div>
                </section>
                <div className="modal-action">
                    <form method="dialog" className="flex gap-5 justify-center" >
                        <button className="btn">Cancel</button>
                        <div className="flex flex-col">
                            <label>add to google calendar<input type="checkbox"  {...register("isDeployingToGoogle", { required: false })}></input></label>
                            {watch("isDeployingToGoogle") && <label>Group email <input type="email" defaultValue={""} {...register("groupEmail", { required: false })}></input></label>}

                        </div>
                        <button className="btn btn-primary" type="submit" onClick={handleSubmit(onSubmit)}>Deploy Bootcamp</button>


                    </form>
                </div>
            </div>

        </>
    )
}