import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { updatePreviewCalendarDates, getGoogleEventListForCourse, moveModule, detectOverlappingDays, getUpdatedCourse, getCourseWithDates } from "../helpers/courseUtils";
import { CourseType, ModuleType, CourseModuleType, DayType, CalendarDateType } from "../../../api/Types";
import { InfoPanel } from "./InfoPanel";
import MiniCalendar from "./MiniCalendar";
import { EditCourseDays } from "@models/appliedCourse/sections/EditCourseDays";
import { postCourseToGoogle } from "@api/googleCalendar/googleCalendarFetches";
import { UseMutationResult } from "@tanstack/react-query";

type Props = {
    course: CourseType,
    submitFunction:  (course: CourseType, navigate: NavigateFunction, mutationPostAppliedCourse: UseMutationResult<void, Error, CourseType, unknown>) => Promise<void>;
    mutation: UseMutationResult<void, Error, CourseType, unknown>
}

type Inputs = {
    isDeployingToGoogle: boolean;
    groupEmail: string;

};

export function EditBootcamp({ course, submitFunction, mutation }: Props) {
    const [startDate, setStartDate] = useState<Date>(new Date());
    // const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const [overlappingDays, setOverlappingDays] = useState<DayType[]>([]);

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
        setSelectedModule(previewCourse.modules.map(m => m.module).find(m => m.id == selectedModule.id)!)
    }, [previewCourse, startDate,selectedModule.id]);


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

        submitFunction(previewCourse, navigate, mutation)
    }




    const handleMoveModule = () => {
        const newModule = moveModule(selectedModule, selectedDate.date);
        const updatedModules: CourseModuleType[] = previewCourse.modules
            .map((m) => (m.module.id == selectedModule.id ? { ...m, module: newModule } : m))
            .sort((a, b) => 
                new Date(a.module.startDate ?? 0).getTime() - new Date(b.module.startDate ?? 0).getTime()
              );
              
    
        let updatedCourse = { ...previewCourse, modules: updatedModules };
        updatedCourse = getUpdatedCourse(updatedCourse, updatedCourse.modules[0].module.days[0].date);
    
        setCourse(updatedCourse);
        setSelectedModule(newModule);
    };
    
    const handleMoveModuleDnd = (moduleId: number, newDate: string) => {
        const selectedModule = previewCourse.modules
            .map((m) => m.module)
            .find((m) => m.id === moduleId);
    
        if (!selectedModule) {
            console.error("Module not found!");
            return;
        }
    
        const newModule = moveModule(selectedModule, new Date(newDate));
        const updatedModules: CourseModuleType[] = previewCourse.modules
            .map((m) => (m.module.id === moduleId ? { ...m, module: newModule } : m))
            .sort((a, b) => 
                new Date(a.module.startDate ?? 0).getTime() - new Date(b.module.startDate ?? 0).getTime()
              );
              
    
        setCourse({ ...previewCourse, modules: updatedModules });
        setSelectedModule(newModule);
    };


    return (
        <>
            <div className="flex flex-col h-[80vh] max-w-full">
                <br />
                <section className="flex flex-grow gap-1">

                    <div className="flex-grow overflow-auto">
                        <MiniCalendar previewCourse={previewCourse} startDate={startDate} previewCalendarDays={previewCalendarDays} selectedModule={selectedModule} selectedModuleStartDate={selectedDate} setSelectedModuleStartDate={setSelectedDate} setSelectedModule={setSelectedModule} handleMoveModuleDnd={handleMoveModuleDnd}/>
                    </div>
                    <div className="flex flex-col w-2/5">
                        <div className="flex">
                            <button className="btn w-1/3" onClick={() => setToggle("info")}>Info</button>
                            <button className="btn w-1/3" onClick={() => setToggle("edit")}>Edit</button>
                            <button className="btn w-1/3">Nothing</button>
                        </div>
                        {overlappingDays.length > 0 && <p className="text-red-600">you have overlapping days!</p> }
                        {toggle == "info" && <InfoPanel course={previewCourse} setCourse={setCourse} selectedModule={selectedModule} selectedDate={selectedDate} handleMoveModule={handleMoveModule} />}
                        {toggle == "edit" && <EditCourseDays appliedCourse={course} course={previewCourse} setCourse={setCourse} handleMoveModule={handleMoveModuleDnd} />}
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