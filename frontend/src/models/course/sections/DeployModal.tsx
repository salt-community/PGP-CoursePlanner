import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { CourseModuleType, CourseType, ModuleType } from "../Types";
import { useMutationPostAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { useNavigate } from "react-router-dom";
// import { useQueryAppliedCourses } from "@api/appliedCourse/appliedCourseQueries";
import MiniCalendar from "./MiniCalendar";
import { calculateCourseDayDates, getGoogleEventListForCourse, getNewDate, moveModule, stripIdsFromCourse, updatePreviewCalendarDates } from "../helpers/courseUtils";
// import EditCourseDays from "./EditCourseDays";
import { getDateAsStringYyyyMmDd } from "@helpers/dateHelpers";
import { useForm, SubmitHandler } from "react-hook-form";
import { postCourseToGoogle } from "@api/googleCalendarFetches";


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
    const [selectedModuleStartDate, setSelectedModuleStartDate] = useState<Date>(getNewDate(new Date(), -8))


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
        if(data.isDeployingToGoogle) {
            const events =getGoogleEventListForCourse(previewCourse, "")
            console.log("Events: ", events)
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
                            <MiniCalendar previewCourse={previewCourse} startDate={startDate} previewCalendarDays={previewCalendarDays} selectedModule={selectedModule} selectedModuleStartDate={selectedModuleStartDate} setSelectedModuleStartDate={setSelectedModuleStartDate} setSelectedModule={setSelectedModule} />
                        </div>
                        <div >
                            {/* <EditCourseDays course={previewCourse} setCourse={setCourse} /> */}
                            <div>
                                <h3 className="font-bold">Change start date of module</h3>
                                <p>Selected module: {selectedModule.name} </p>
                                <p>current start: {getDateAsStringYyyyMmDd(selectedModule.startDate)} </p>
                                <p>new start: {getDateAsStringYyyyMmDd(selectedModuleStartDate)}</p>
                                <button className="btn" onClick={(event) => {
                                    event.preventDefault()
                                    const newModule = moveModule(selectedModule, selectedModuleStartDate)
                                    const updatedModules: CourseModuleType[] = previewCourse.modules.map((m) =>
                                        m.module.id == selectedModule.id
                                            ? { ...m, module: newModule }
                                            : m
                                    );
                                    setCourse({ ...previewCourse, modules: updatedModules });
                                    setSelectedModule(newModule)
                                }}>update module start date</button>
                            </div>
                        </div>
                    </section>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-5 justify-center" onSubmit={handleSubmit(onSubmit)}>
                            <button className="btn">Cancel</button>
                            <div className="flex flex-col">
                                <label>add to google calendar<input type="checkbox"  {...register("isDeployingToGoogle", { required: false })}></input></label>
                                <label>Group email <input type="email" defaultValue={course.name} {...register("groupEmail", { required: false })}></input></label> 
                            </div>
                            <button className="btn btn-primary" type="submit">Deploy Bootcamp</button>


                        </form>
                    </div>
                </div>
            </dialog>

        </>
    )
}