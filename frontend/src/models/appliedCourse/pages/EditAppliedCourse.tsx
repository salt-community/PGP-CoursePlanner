import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import {
    editAppliedCourse,
    getAllAppliedCourses,
    getAppliedCourseById,
} from "@api/AppliedCourseApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppliedCourseType } from "@models/course/Types";
import { getCookie } from "@helpers/cookieHelpers";
import Login from "@models/login/Login";
import InputSmall from "@components/inputFields/InputSmall";
import { AppliedModuleType } from "../Types";
import ColorPickerModal from "@components/ColorPickerModal";
import ModuleEdit from "../sections/moduleEdit";

export default function EditAppliedCourse() {
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const [isInvalidModule, setIsInvalidModule] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [color, setColor] = useState<string>("");
    const [appliedCourseName, setAppliedCourseName] = useState<string>("");
    const [appliedModules, setAppliedModules] = useState<AppliedModuleType[]>([]);

    const navigate = useNavigate();

    const handleUpdateModules = (updatedModules: AppliedModuleType[]) => {
        setAppliedModules(updatedModules);
    };

    const { data: allAppliedCourses } = useQuery({
        queryKey: ["appliedCourses"],
        queryFn: () => getAllAppliedCourses(),
    });

    const appliedCourseId = useIdFromPath();
    const [appliedCourse, setAppliedCourse] = useState<AppliedCourseType | null>(
        null
    );

    useEffect(() => {
        getAppliedCourseById(parseInt(appliedCourseId)).then((result) => {
            if (result) {
                setAppliedCourse(result);
                setStartDate(
                    result.startDate ? new Date(result.startDate) : new Date()
                );
                setColor(result.color || "");
                setAppliedCourseName(result.name || "");
                setAppliedModules(result.modules || []);
            }
        });
    }, [appliedCourseId]);

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
            const appliedCoursesWithCourseId = allAppliedCourses!.filter(
                (m) => m.courseId == appliedCourse!.courseId
            );
            if (appliedCoursesWithCourseId.length > 0 && color != defaultColor) {
                await Promise.all(
                    appliedCoursesWithCourseId.map(async (appliedCourse) => {
                        try {
                            const newAppliedCourse: AppliedCourseType = {
                                id: appliedCourse.id,
                                name: appliedCourse.name,
                                startDate: appliedCourse.startDate,
                                endDate: appliedCourse.endDate,
                                courseId: appliedCourse.courseId,
                                modules: appliedCourse.modules,
                                color: color,
                            };
                            await editAppliedCourse(newAppliedCourse);
                        } catch (error) {
                            console.error("Error posting applied event:", error);
                        }
                    })
                );
            }

            const newAppliedCourse: AppliedCourseType = {
                name: appliedCourseName,
                id: appliedCourse!.id,
                courseId: appliedCourse!.courseId,
                startDate: startDate,
                color: color,
                modules: appliedModules!,
            };
            mutation.mutate(newAppliedCourse);
        }
    };
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (newAppliedCourse: AppliedCourseType) => {
            return editAppliedCourse(newAppliedCourse);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appliedCourses"] });
            navigate(`/activecourses`);
        },
    });

    function getLastTrackedUrl(): string | null {
        const history = JSON.parse(localStorage.getItem("urlHistory") || "[]");

        if (history.length > 0) {
            return history[history.length - 1];
        } else {
            return null;
        }
    }
    const lastTrackedUrl = getLastTrackedUrl();
    const splitUrl = lastTrackedUrl?.split("5173"); //change this for deploy! TODO

    return getCookie("access_token") == undefined ? (
        <Login />
    ) : (
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
                       <ModuleEdit appliedModules={appliedModules || []} onUpdateModules={handleUpdateModules}/>                      
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
                                onClick={() => navigate(splitUrl![1])}
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
