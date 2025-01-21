import { useMutationPostAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { postCourseToGoogle } from "@api/googleCalendarFetches";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { calculateCourseDayDates, updatePreviewCalendarDates, getGoogleEventListForCourse, stripIdsFromCourse, moveModule } from "../helpers/courseUtils";
import { CourseType, ModuleType, CalendarDateType, CourseModuleType } from "../Types";
import EditCourseDays from "./EditCourseDays";
import { InfoPanel } from "./InfoPanel";
import MiniCalendar from "./MiniCalendar";

type Props = {
    course: CourseType,
}

type Inputs = {
    isDeployingToGoogle: boolean;
    groupEmail: string;
};




export function EditBootcamp({ course }: Props) {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);

    const mutationPostAppliedCourse = useMutationPostAppliedCourse();

    const navigate = useNavigate();

    calculateCourseDayDates(course, startDate)
    const [previewCourse, setCourse] = useState<CourseType>(course);
    const [previewCalendarDays, setPreviewCalendarDays] = useState(updatePreviewCalendarDates(previewCourse))

    const [selectedModule, setSelectedModule] = useState<ModuleType>(previewCourse.modules[0].module);
    const [selectedDate, setSelectedDate] = useState<CalendarDateType>({ date: (new Date()), dateContent: [] })


    useEffect(() => {
        const updatedDays = calculateCourseDayDates(previewCourse, startDate);
        setPreviewCalendarDays(updatedDays);
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

        handleApplyTemplate()
    }


    const handleApplyTemplate = async () => {

        const myTrack = previewCourse.track.id;
        const myCourse = stripIdsFromCourse(previewCourse)
        myCourse.track.id = myTrack

        setIsInvalidDate(false);
        if (
            startDate.getDay() == 6 ||
            startDate.getDay() == 0
        ) {
            if (startDate.getDay() == 6 || startDate.getDay() == 0)
                setIsInvalidDate(true);
        } else {
            mutationPostAppliedCourse.mutate(myCourse);
            navigate("/activecourses");
        }
    };


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

    console.log(watch("isDeployingToGoogle"))

    return (
        <>
                <div className="modal-box flex flex-col h-[80vh] w-full max-w-5xl">

                    <br />
                    <section className="flex flex-grow">

                        <div className="flex-grow overflow-auto">
                            <MiniCalendar previewCourse={previewCourse} startDate={startDate} previewCalendarDays={previewCalendarDays} selectedModule={selectedModule} selectedModuleStartDate={selectedDate} setSelectedModuleStartDate={setSelectedDate} setSelectedModule={setSelectedModule} />
                        </div>
                        <InfoPanel selectedModule={selectedModule} selectedDate={selectedDate} handleMoveModule={handleMoveModule} />
                        <EditCourseDays course={previewCourse} setCourse={setCourse} />
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