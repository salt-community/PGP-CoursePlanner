import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import { CourseType, CourseModuleType, DayType } from "@models/course/Types";
import { useNavigate } from "react-router-dom";
import TrashIcon from "../components/TrashIcon";
import DotsIcon from "../components/DotsIcon";

export default function EditAppliedCourse() {
    const appliedCourseId = useIdFromPath();
    const { data: appliedCourse, isLoading, isError } = useQueryAppliedCourseById(appliedCourseId);
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();

    const [course, setCourse] = useState<CourseType>({
        name: "",
        startDate: new Date(),
        modules: [],
    });

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); 
    };

    useEffect(() => {
        if (appliedCourse) {
            setCourse({
                ...appliedCourse,
                modules: appliedCourse.modules.map((module) => ({
                    courseId: appliedCourse.id,
                    moduleId: module.module.id,
                    module: module.module, 
                }))
            });
        }
    }, [appliedCourse]);

    const handleRemoveModule = (index: number) => {
        setCourse((prevCourse) => ({
            ...prevCourse,
            modules: prevCourse.modules.filter((_, i) => i !== index),
        }));
    };
    const handleCreateNewAppliedModule = () => {
        const newModule: CourseModuleType = {
            courseId: course.id || 0, 
            moduleId: 0,
            module: {
                id: 0,
                name: "",
                order: 0,
                track: [],
                isApplied: false,
                numberOfDays: 0,
                days: [],
            }
        };

        setCourse((prevCourse) => ({
            ...prevCourse,
            modules: [...prevCourse.modules, newModule], 
        }));
    };

    const handleCreateNewDay = (moduleIndex: number) => {
        const newDay: DayType = {
            id: 0,
            dayNumber: 42,
            description: "",
            isApplied: true,
            events: [],
            
        };
    
        setCourse((prevCourse) => {
            const updatedModules = prevCourse.modules.map((module, index) => {
                if (index === moduleIndex) {
                    return {
                        ...module, 
                        module: {
                            ...module.module, 
                            days: [...module.module.days, newDay], 
                        },
                    };
                }
                return module; 
            });
    
            return {
                ...prevCourse, 
                modules: updatedModules, 
            };
        });
    };

    const handleRemoveDay = (moduleIndex: number, dayIndex: number) => {
        setCourse((prevCourse) => {
            const updatedModules = [...prevCourse.modules];
            updatedModules[moduleIndex].module.days = updatedModules[moduleIndex].module.days.filter(
                (_, i) => i !== dayIndex
            );
            return { ...prevCourse, modules: updatedModules };
        });
    };

    const handleCreateNewEvent = (moduleIndex: number, dayIndex: number) => {
        const newEvent = {
            id: 0,
            name: "New Event",        
            startTime: "00:00",       
            endTime: "00:00",         
            description: "",          
            isApplied: true,          
        };
    
        setCourse((prevCourse) => {
            const updatedModules = prevCourse.modules.map((module, mIndex) => {
                if (mIndex === moduleIndex) {
                    return {
                        ...module,
                        module: {
                            ...module.module,
                            days: module.module.days.map((day, dIndex) => {
                                if (dIndex === dayIndex) {
                                    return {
                                        ...day,
                                        events: [...day.events, newEvent],
                                    };
                                }
                                return day;
                            }),
                        },
                    };
                }
                return module;
            });
    
            return {
                ...prevCourse,
                modules: updatedModules,
            };
        });
    };
    
    
    const handleRemoveEvent = (moduleIndex: number, dayIndex: number, eventIndex: number) => {
        setCourse((prevCourse) => {
            const updatedModules = prevCourse.modules.map((module, mIndex) => {
                if (mIndex === moduleIndex) {
                    return {
                        ...module,
                        module: {
                            ...module.module,
                            days: module.module.days.map((day, dIndex) => {
                                if (dIndex === dayIndex) {
                                    return {
                                        ...day,
                                        events: day.events.filter((_, eIndex) => eIndex !== eventIndex),
                                    };
                                }
                                return day;
                            }),
                        },
                    };
                }
                return module;
            });
    
            return {
                ...prevCourse,
                modules: updatedModules,
            };
        });
    };
    

    const handleUpdateCourse = () => {
        if (appliedCourse) {
            mutationUpdateAppliedCourse.mutate(course);
        }
    };

    if (isLoading) {
        return <p>Loading course data...</p>;
    }

    if (isError || !appliedCourse) {
        return <p>There was an error loading the course data.</p>;
    }

    return (
        <Page>
            <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-5">
                <section
                    className="px-4 md:px-24 lg:px-56"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        padding: "20px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        width: "80%", 
                        display: "flex", 
                        flexDirection: "column", 
                        marginTop: "20px", 
                    }}
                >
                    <div className="flex flex-row gap-5 mt-2 mb-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-lg font-medium">
                                Course name:
                            </label>
                            <input
                                type="text"
                                value={course.name}
                                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-lg font-medium">
                            Track:
                        </label>
                        <select
                            value={course.track}
                            onChange={(e) => setCourse({ ...course, track: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled>Select a track</option>
                            <option value="Track 1">Track 1</option>
                            <option value="Track 2">Track 2</option>
                            <option value="Track 3">Track 3</option>
                        </select>
                    </div>
                    </div>
                    {course.modules.map((courseModule, moduleIndex) => (
                        <div className="bg-base-100 flex space-between mb-4 rounded-r-lg border-r border-b border-black" key={moduleIndex}>
                        <div className="collapse border-t border-l border-black rounded-none">
                            <input type="checkbox" />
                            <div className="collapse-title text-xl font-medium border-b border-black">
                                <div className="flex items-center">
                                    <DotsIcon position="mr-1" size={6} />
                                    {courseModule.module.name}
                                </div>
                            </div>
                            <div className="collapse-content">

                            <div className="p-4">
                                <label>
                                    Module Name:
                                    <input
                                        type="text"
                                        value={courseModule.module.name}
                                        onChange={(e) => {
                                            const updatedModules = [...course.modules];
                                            updatedModules[moduleIndex].module.name = e.target.value;
                                            setCourse({ ...course, modules: updatedModules });
                                        }}
                                        style={{ padding: "5px", border: "1px solid gray" }}
                                    />
                                </label>
                            </div>
                            {courseModule.module.days.map((day, dayIndex) => (
                                <div className="bg-base-200 flex space-between border border-black mb-4 rounded-r-lg" key={dayIndex} >
                                    <div className="collapse">
                                    <input type="checkbox" />
                                    <div className="collapse-title text-xl font-medium">
                                        <div className="flex items-center">
                                            <DotsIcon position="mr-1" size={6} />
                                            Day {dayIndex + 1} {day.description}
                                        </div>
                                    </div>
                                    <div className="collapse-content border-t border-black rounded-none">
                                        <div className="pt-4 pb-8">
                                        <label>
                                            Description:
                                            <input
                                                type="text"
                                                value={day.description}
                                                onChange={(e) => {
                                                    const updatedModules = [...course.modules];
                                                    updatedModules[moduleIndex].module.days[dayIndex].description = e.target.value;
                                                    setCourse({ ...course, modules: updatedModules });
                                                }}
                                                style={{ padding: "5px", border: "1px solid gray" }}
                                            />
                                        </label>
                                        </div>
                                        {day.events.map((event, eventIndex) => (
                                            <div
                                                key={eventIndex}
                                                className="flex flex-row  items-center justify-between gap-4 mt-4 p-4 border-b border-gray-300 rounded-md"
                                            >
                                                <div className="flex flex-row gap-4">
                                                   
                                                <label className="flex flex-col">
                                                Event Name:
                                                <input
                                                    type="text"
                                                    value={event.name}
                                                    onChange={(e) => {
                                                    const updatedModules = [...course.modules];
                                                    updatedModules[moduleIndex].module.days[dayIndex].events[eventIndex].name =
                                                        e.target.value;
                                                    setCourse({ ...course, modules: updatedModules });
                                                    }}
                                                    className="p-2 border border-gray-300 rounded-md"
                                                />
                                                </label>

                                                <label className="flex flex-col">
                                                Description:
                                                <input
                                                    type="text"
                                                    value={event.description}
                                                    onChange={(e) => {
                                                    const updatedModules = [...course.modules];
                                                    updatedModules[moduleIndex].module.days[dayIndex].events[eventIndex].description =
                                                        e.target.value;
                                                    setCourse({ ...course, modules: updatedModules });
                                                    }}
                                                    className="p-2 border border-gray-300 rounded-md w-full sm:w-96 md:w-128"
                                                />
                                                </label> 

                                                <label className="flex flex-col">
                                                Start Time:
                                                <input
                                                    type="time"
                                                    value={event.startTime}
                                                    onChange={(e) => {
                                                    const updatedModules = [...course.modules];
                                                    updatedModules[moduleIndex].module.days[dayIndex].events[eventIndex].startTime =
                                                        e.target.value;
                                                    setCourse({ ...course, modules: updatedModules });
                                                    }}
                                                    className="p-2 border border-gray-300 rounded-md"
                                                />
                                                </label>

                                                <label className="flex flex-col">
                                                End Time:
                                                <input
                                                    type="time"
                                                    value={event.endTime}
                                                    onChange={(e) => {
                                                    const updatedModules = [...course.modules];
                                                    updatedModules[moduleIndex].module.days[dayIndex].events[eventIndex].endTime =
                                                        e.target.value;
                                                    setCourse({ ...course, modules: updatedModules });
                                                    }}
                                                    className="p-2 border border-gray-300 rounded-md"
                                                />
                                                </label>
                                                </div>
                                                    <button onClick={() => handleRemoveEvent(moduleIndex, dayIndex, eventIndex)} className="btn btn-square btn-outline scale-75">
                                                        <TrashIcon size={6} />
                                                    </button>
                                            </div>
                                            ))}
                                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                    <PrimaryBtn onClick={() => handleCreateNewEvent(moduleIndex, dayIndex)}>
                                        Add Event
                                    </PrimaryBtn>
                                </div>
                                </div>
                                </div>
                                    <div className="flex justify-end">
                                        <button onClick={() => handleRemoveDay(moduleIndex, dayIndex)} className="btn btn-square btn-outline h-[61px] w-[61px] rounded-none rounded-r-lg">
                                        <TrashIcon size={6} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <PrimaryBtn onClick={() => handleCreateNewDay(moduleIndex)}>
                                    Add Day
                                </PrimaryBtn>
                            </div>
                            </div>
                        </div>
                            <div className="flex justify-end ">
                                <button
                                    onClick={() => handleRemoveModule(moduleIndex)}
                                    className="btn btn-square btn-outline h-[62px] w-[62px] rounded-none rounded-r-lg"
                                >
                                    <TrashIcon size={6} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <PrimaryBtn onClick={handleCreateNewAppliedModule}>
                                Add Module
                            </PrimaryBtn>
                            <PrimaryBtn onClick={handleCreateNewAppliedModule}>
                               from template!?
                            </PrimaryBtn>
                        </div>
                        <PrimaryBtn onClick={handleUpdateCourse}>Save</PrimaryBtn>
                    <PrimaryBtn onClick={handleGoBack}>Abort</PrimaryBtn>
                    </div>
                </section>
            </div>
        </Page>
    );
}
