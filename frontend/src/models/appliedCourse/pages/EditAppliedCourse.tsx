import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Page from "../../../components/Page";
import { useIdFromPath } from "../../../helpers/helperHooks";
import {
    editAppliedCourse,
    getAllAppliedCourses,
    getAppliedCourseById,
} from "../../../api/AppliedCourseApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppliedCourseType } from "../../course/Types";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";
import AppliedModule from "../sections/AppliedModule";
import InputSmall from "../../../components/inputFields/InputSmall";
import { AppliedDayType, AppliedEventType, AppliedModuleType } from "../Types";
import PrimaryBtn from "../../../components/buttons/PrimaryBtn";
import TrashBtn from "../../../components/buttons/TrashBtn";
import { getAllModules } from "../../../api/ModuleApi";
import {
    postAppliedModule,
    updateAppliedModule,
} from "../../../api/AppliedModuleApi";
import { postAppliedEvent } from "../../../api/AppliedEventApi";
import { postAppliedDay } from "../../../api/AppliedDayApi";
import ColorPickerModal from "../../../components/ColorPickerModal";
import { reorderModule } from "../helpers/reorderModule";

export default function EditAppliedCourse() {
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const [isInvalidModule, setIsInvalidModule] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [color, setColor] = useState<string>("");
    const [appliedCourseName, setAppliedCourseName] = useState<string>("");
    const [appliedModules, setAppliedModules] = useState<AppliedModuleType[]>();

    const navigate = useNavigate();

    const { data: modules } = useQuery({
        queryKey: ["modules"],
        queryFn: getAllModules,
    });

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

    async function editAppliedModule(
        index: number,
        appliedModule: AppliedModuleType
    ) {
        const newAppliedModules = [...appliedModules!];
        newAppliedModules[index] = appliedModule;
        setAppliedModules(newAppliedModules);
    }

    const handleAddModule = (index: number) => {
        const emptyModule: AppliedModuleType = {
            id: 0,
            name: "",
            numberOfDays: 1,
            days: [],
        };

        postAppliedModule(emptyModule)
            .then((response) => {
                if (response) {
                    const editedModules = [...appliedModules!];
                    editedModules.splice(index + 1, 0, response);
                    setAppliedModules(editedModules);
                }
            })
            .catch((error) => {
                console.error("Error posting applied module:", error);
            });
    };

    const handleDeleteModule = (index: number) => {
        const editedModules = [...appliedModules!];
        editedModules.splice(index, 1);
        setAppliedModules(editedModules);
    };
 
    const moveModuleUp = (index: number) => {
        setAppliedModules((prevModules) => reorderModule(prevModules ?? [], index, "up"));
    };
    const moveModuleDown = (index: number) => {
        setAppliedModules((prevModules) => reorderModule(prevModules ?? [], index, "down"));
    };

    const handleChange = async (event: SyntheticEvent) => {
        const value = (event.target as HTMLSelectElement).value;
        const [moduleId, indexStr, appModuleId] = value.split("_");
        const moduleIndex = parseInt(indexStr);
        const appliedModuleId = parseInt(appModuleId);

        if (!modules) {
            console.error("Modules data is loading");
            return;
        }
        const module = modules.find((m) => m.id === parseInt(moduleId));
        if (!module) {
            console.error("Sorry Module Not Found");
            return;
        }

        const listDays: AppliedDayType[] = [];

        await Promise.all(
            module.days.map(async (day) => {
                const listEvents: AppliedEventType[] = [];
                await Promise.all(
                    day.events.map(async (eventItem) => {
                        try {
                            const newEvent = {
                                id: 0,
                                name: eventItem.name,
                                description: eventItem.description,
                                startTime: eventItem.startTime,
                                endTime: eventItem.endTime,
                            };
                            const response = await postAppliedEvent(newEvent);
                            if (response) listEvents.push(response);
                        } catch (error) {
                            console.error("Error posting applied event:", error);
                        }
                    })
                );

                const newDay = {
                    id: 0,
                    dayNumber: day.dayNumber,
                    description: day.description,
                    events: listEvents,
                };

                try {
                    const response = await postAppliedDay(newDay);
                    if (response) listDays.push(response);
                } catch (error) {
                    console.error("Error posting applied day:", error);
                }
            })
        );

        const newAppliedModule: AppliedModuleType = {
            id: appliedModuleId,
            name: module.name,
            numberOfDays: listDays.length,
            days: listDays.sort((a, b) => a.dayNumber - b.dayNumber),
        };

        updateAppliedModule(newAppliedModule)
            .then((response) => {
                if (response) {
                    const updatedModules = [...appliedModules!];
                    updatedModules[moduleIndex] = newAppliedModule;
                    setAppliedModules(updatedModules);
                }
            })
            .catch((error) => {
                console.error("Error posting applied module:", error);
            });
    };

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
            queryClient.invalidateQueries({ queryKey: ["allAppliedCourses"] });
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
                        <div className="flex flex-row gap-4 items-center">
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

                        <div className="flex flex-row gap-4 items-center">
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
                        <ColorPickerModal color={color} setColor={setColor} />
                        {modules &&
                            appliedModules &&
                            appliedModules.map((appliedModule, index) => (
                                <div key={index}>
                                    {appliedModule.name == "" ? (
                                        <div className="collapse border-primary border mb-2">
                                            <input
                                                type="checkbox"
                                                id={`collapse-toggle-${index}`}
                                                className="hidden"
                                            />
                                            <div className="collapse-title flex flex-row">
                                                <label
                                                    htmlFor={`collapse-toggle-${index}`}
                                                    className="cursor-pointer flex flex-row"
                                                >
                                                    <h1 className="text-lg text-primary">
                                                        Module {index + 1}:
                                                    </h1>
                                                </label>
                                                <div className="flex flex-col ml-1">
                                                    <select
                                                        className="border border-gray-300 rounded-lg p-1 w-48"
                                                        onChange={handleChange}
                                                        defaultValue={"DEFAULT"}
                                                    >
                                                        <option value="DEFAULT" disabled>
                                                            Select
                                                        </option>
                                                        {modules.map((module) => (
                                                            <option
                                                                key={module.id}
                                                                value={`${module.id}_${index}_${appliedModule.id}`}
                                                            >
                                                                {module.name} ({module.numberOfDays} days)
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="collapse border-primary border mb-2 ">
                                            <input
                                                type="checkbox"
                                                id={`collapse-toggle-${index}`}
                                                className="hidden"
                                            />
                                            <div className="collapse-title flex flex-row">
                                                {index == 0 && index != appliedModules.length - 1 && (
                                                    <div className="flex flex-col w-[26px] mr-2">
                                                        <button
                                                            type="button"
                                                            className="w-full h-full self-center"
                                                            onClick={() => moveModuleDown(index)}
                                                        >
                                                            <svg
                                                                className="self-center"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="#3F00E7"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M6 9l6 6 6-6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                                {index != 0 && index == appliedModules.length - 1 && (
                                                    <div className="flex flex-col w-[26px] mr-2">
                                                        <button
                                                            type="button"
                                                            className="w-full h-full self-center"
                                                            onClick={() => moveModuleUp(index)}
                                                        >
                                                            <svg
                                                                className="self-center"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="#3F00E7"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M18 15l-6-6-6 6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                                {index != 0 && index != appliedModules.length - 1 && (
                                                    <div className="flex flex-col w-[26px] mr-2">
                                                        <button
                                                            type="button"
                                                            className="w-full h-full self-center"
                                                            onClick={() => moveModuleUp(index)}
                                                        >
                                                            <svg
                                                                className="self-center"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="#3F00E7"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M18 15l-6-6-6 6" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="w-full h-full self-center"
                                                            onClick={() => moveModuleDown(index)}
                                                        >
                                                            <svg
                                                                className="self-center"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="#3F00E7"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M6 9l6 6 6-6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                                {index == 0 && index == appliedModules.length - 1 && (
                                                    <div className="flex flex-col w-[26px] mr-2"></div>
                                                )}
                                                <label
                                                    htmlFor={`collapse-toggle-${index}`}
                                                    className="cursor-pointer flex flex-row w-5/6"
                                                >
                                                    <h1 className="text-lg text-primary self-center">
                                                        Module {index + 1}: {appliedModule.name}
                                                    </h1>
                                                </label>
                                                <div className="w-1/6 flex gap-1 justify-end items-center">
                                                    <PrimaryBtn onClick={() => handleAddModule(index)}>
                                                        +
                                                    </PrimaryBtn>
                                                    {appliedModules.length > 1 ? (
                                                        <TrashBtn
                                                            handleDelete={() => handleDeleteModule(index)}
                                                        />
                                                    ) : (
                                                        <div className="w-12"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="collapse-content">
                                                <AppliedModule
                                                    key={appliedModule.id}
                                                    module={appliedModule}
                                                    index={index}
                                                    submitFunction={editAppliedModule}
                                                    buttonText="Save module changes"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
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
                                Save all changes
                            </button>
                            <button
                                onClick={() => navigate(splitUrl![1])}
                                className="btn btn-sm mt-6 max-w-66 btn-info text-white"
                            >
                                Go back without saving changes
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </Page>
    );
}
