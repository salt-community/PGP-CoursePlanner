import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { CalendarDateType, CourseModuleType, CourseType, ModuleType } from "../Types";
import { useMutationPostAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { useNavigate } from "react-router-dom";
// import { useQueryAppliedCourses } from "@api/appliedCourse/appliedCourseQueries";
import MiniCalendar from "./MiniCalendar";
import { calculateCourseDayDates, getGoogleEventListForCourse, moveModule, stripIdsFromCourse, updatePreviewCalendarDates } from "../helpers/courseUtils";
// import EditCourseDays from "./EditCourseDays";
import { getDateAsStringYyyyMmDd } from "@helpers/dateHelpers";
import { useForm, SubmitHandler } from "react-hook-form";
import { postCourseToGoogle } from "@api/googleCalendarFetches";
import EventDescription from "@models/home/components/EventDescription";


type Props = {
    course: CourseType,
}

type Inputs = {
    isDeployingToGoogle: boolean;
    groupEmail: string;
};



export default function DeployModal({ course }: Props) {

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
        const updatedDays = updatePreviewCalendarDates(previewCourse);
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

    console.log(watch("isDeployingToGoogle"))


    return (
        <>
            <dialog id="my_DeployModal_1" className="modal">
                <div className="modal-box flex flex-col h-[80vh] w-full max-w-5xl">
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
                            <MiniCalendar previewCourse={previewCourse} startDate={startDate} previewCalendarDays={previewCalendarDays} selectedModule={selectedModule} selectedModuleStartDate={selectedDate} setSelectedModuleStartDate={setSelectedDate} setSelectedModule={setSelectedModule} />
                        </div>
                        <div className="p-4">
                            {/* <EditCourseDays course={previewCourse} setCourse={setCourse} /> */}
                            <div >
                                <h3 className="font-bold">Change start date of module</h3>
                                <p>Selected module: {selectedModule.name} </p>
                                <p>current start: {getDateAsStringYyyyMmDd(selectedModule.startDate)} </p>
                                <p>new start: {getDateAsStringYyyyMmDd(selectedDate.date)}</p>
                                <button className="btn" onClick={(event) => {
                                    event.preventDefault()
                                    const newModule = moveModule(selectedModule, selectedDate.date)
                                    const updatedModules: CourseModuleType[] = previewCourse.modules.map((m) =>
                                        m.module.id == selectedModule.id
                                            ? { ...m, module: newModule }
                                            : m
                                    );
                                    setCourse({ ...previewCourse, modules: updatedModules });
                                    setSelectedModule(newModule)
                                }}>update module start date</button>
                            </div>
                            <div>
                                <h4 className="font-bold pt-6">selected day's events </h4>
                                {selectedDate.dateContent.map((content, index) => (
                                    <div key={content.id ?? index} className="mb-4 flex flex-col items-center">
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {content.courseName}
                                            </h2>
                                            <h3 className="text-lg pb-2">
                                                Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                                            </h3>
                                            {content.events.length > 0 ? (
                                                content.events.map((event) => (
                                                    <div key={event.id ?? event.name} className="pb-2 mb-2">
                                                        <div className="flex items-center gap-2 justify-between min-w-96">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-4 h-4 rounded-[3px]" style={{ backgroundColor: `${content.color}` }}></div>
                                                                <p>{event.name}</p>
                                                            </div>
                                                            <p>
                                                                {event.startTime} - {event.endTime}
                                                            </p>
                                                        </div>
                                                        {event.description && (
                                                            <EventDescription description={event.description} />
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-lg">No events for this module.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                            </div>
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
            </dialog>

        </>
    )
}