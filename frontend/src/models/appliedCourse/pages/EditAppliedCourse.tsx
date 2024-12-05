import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputSmall from "@components/inputFields/InputSmall";
import ColorPickerModal from "@components/ColorPickerModal";
import ModuleEdit from "../sections/ModuleEdit";
import { ModuleType } from "@models/module/Types";
import { CourseType } from "@models/course/Types";
import { useQueryAppliedCourseById, useQueryAppliedCourses } from "@api/appliedCourse/appliedCourseQueries";
import { useQueryModulesByCourseId } from "@api/course/courseQueries";
import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { useMutationUpdateAppliedModule } from "@api/appliedModule/appliedModuleMutations";

export default function EditAppliedCourse() {
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const [isInvalidModule, setIsInvalidModule] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [color, setColor] = useState<string>("");
    const [appliedCourseName, setAppliedCourseName] = useState<string>("");
    const [appliedModules, setAppliedModules] = useState<ModuleType[]>([]);
    const appliedCourseId = useIdFromPath();
    const navigate = useNavigate();
    const { data: appliedCourses } = useQueryAppliedCourses();
    const { data: appliedCourse } = useQueryAppliedCourseById(appliedCourseId);
    const { data: courseModules } = useQueryModulesByCourseId(appliedCourseId);
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();
    const mutationUpdateAppliedModule = useMutationUpdateAppliedModule();

    const handleUpdateModules = (updatedModules: ModuleType[]) => {
        setAppliedModules(updatedModules);
        for (let i = 0; i < updatedModules.length; i++) {
            mutationUpdateAppliedModule.mutate(updatedModules[i]);
        }
    };

    useEffect(() => {
        if (appliedCourse) {
            setStartDate(
                appliedCourse.startDate ? new Date(appliedCourse.startDate) : new Date()
            );
            setColor(appliedCourse.color || "");
            setAppliedCourseName(appliedCourse.name || "");
            setAppliedModules(courseModules || []);
        }
    }, [appliedCourse, courseModules])

    const defaultColor = appliedCourse?.color || "";

    const handleEdit = async () => {
        setIsInvalidDate(false);
        setIsInvalidModule(false);
        if (
            startDate.getDay() == 6 ||
            startDate.getDay() == 0 ||
            appliedModules?.find((m) => m.name == "")
        ) {
            if (startDate.getDay() == 6 || startDate.getDay() == 0)
                setIsInvalidDate(true);
            if (appliedModules?.find((m) => m.name == "")) setIsInvalidModule(true);
        } else {
            const appliedCoursesWithCourseId = appliedCourses!.filter(
                (m) => m.id == appliedCourse!.id
            );
            if (appliedCoursesWithCourseId.length > 0 && color != defaultColor) {
                await Promise.all(
                    appliedCoursesWithCourseId.map(async (appliedCourse) => {
                        const newAppliedCourse: CourseType = {
                            id: appliedCourse.id,
                            name: appliedCourse.name,
                            startDate: appliedCourse.startDate,
                            endDate: appliedCourse.endDate,
                            color: color,
                            isApplied: appliedCourse.isApplied,
                            moduleIds: appliedModules.map(m => m.id!),
                        };
                        mutationUpdateAppliedCourse.mutate(newAppliedCourse);
                    })
                );
            }

            const newAppliedCourse: CourseType = {
                name: appliedCourseName,
                id: appliedCourse!.id,
                startDate: startDate,
                color: color,
                moduleIds: appliedModules.map(m => m.id!),
                isApplied: appliedCourse!.isApplied
            };
            mutationUpdateAppliedCourse.mutate(newAppliedCourse);
        }
    };

    return (
        <Page>
            <section className="px-4 md:px-24 lg:px-56">

                {appliedCourse !== undefined && (
                    <div>
                        <div className="flex flex-row gap-4 items-center p-1">
                            <div className="self-start mt-2">
                                <h2 className="text-lg mb-2 w-[150px]">Bootcamp Name: </h2>
                            </div>
                            <InputSmall
                                type="text"
                                name="bootcampName"
                                onChange={(e) => setAppliedCourseName(e.target.value)}
                                placeholder="Module name"
                                value={appliedCourseName}
                            />
                        </div>

                        <div className="flex flex-row gap-4 items-center p-1">
                            <div className="self-start mt-2 w-[150px]">
                                <h2 className="text-lg mb-2">Start Date: </h2>
                            </div>
                            <DatePicker
                                name="startDate"
                                value={startDate}
                                onChange={(date) => setStartDate(date!)}
                                className="max-w-xs"
                                sx={{
                                    height: "35px",
                                    padding: "0px",
                                    "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                                        fontFamily: "Montserrat",
                                        color: "var(--fallback-bc,oklch(var(--bc)/0.7))",
                                        padding: "6px",
                                    },
                                }}
                            />
                        </div>
                        <div className="p-1">
                            <ColorPickerModal color={color} setColor={setColor} />
                        </div>
                        <div className="mt-10 mb-10">
                            <ModuleEdit appliedModules={appliedModules || []} onUpdateModules={handleUpdateModules} />
                        </div>
                        {isInvalidDate && (
                            <p
                                className="error-message text-red-600 text-sm mt-4"
                                id="invalid-helper"
                            >
                                Please select a weekday for the start date
                            </p>
                        )}
                        {isInvalidModule && (
                            <p
                                className="error-message text-red-600 text-sm mt-4"
                                id="invalid-helper"
                            >
                                Please select a module
                            </p>
                        )}
                        <div className="flex flex-row gap-2">
                            <button
                                onClick={handleEdit}
                                className="btn btn-sm mt-6 max-w-48 btn-success text-white"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-sm mt-6 max-w-66 btn-info text-white"
                            >
                                Abort
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </Page>
    );
}
