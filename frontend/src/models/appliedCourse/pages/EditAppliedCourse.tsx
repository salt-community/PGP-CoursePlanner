import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import { CourseType, CourseModuleType, DayType } from "@models/course/Types";
import { useNavigate } from "react-router-dom";

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
            console.log("The course im sending")
            console.log(course);
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
            <div
                style={{
                    backgroundColor: "#f5f5f5",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center", 
                    paddingTop: "20px", 
                }}
            >
                <div
                    style={{
                        width: "80%", 
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px", 
                        marginTop: "20px", 
                    }}
                >
                    <PrimaryBtn onClick={handleUpdateCourse}>Save</PrimaryBtn>
                    <PrimaryBtn onClick={handleGoBack}>Abort</PrimaryBtn>
                </div>
                
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

                        
                        <div className="bg-base-100 flex space-between" key={moduleIndex}>
                        <div className="collapse  mb-4">

                            <input type="checkbox" />
                            <div className="collapse-title text-xl font-medium">
                                {courseModule.module.name}
                            </div>
                            <div className="collapse-content">
                            <div style={{ display: "flex", gap: "10px" }}>
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
                                <div className="bg-base-100 flex space-between" key={dayIndex} >
                                    <div className="collapse mb-4">
                                    <input type="checkbox" />
                                    <div className="collapse-title text-xl font-medium">
                                    Day {dayIndex + 1} {day.description}
                                    </div>
                                    <div className="collapse-content">
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
                                        {day.events.map((event, eventIndex) => (
                                            <div
                                                key={eventIndex}
                                                className="flex flex-row gap-4 mt-4 p-4 border border-gray-300 rounded-md"
                                            >
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

                                                <div className="flex ml-auto">
                                                <PrimaryBtn onClick={() => handleRemoveEvent(moduleIndex, dayIndex, eventIndex)}>
                                                    Del
                                                </PrimaryBtn>
                                                </div>
                                            </div>
                                            ))}


                                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                    <PrimaryBtn onClick={() => handleCreateNewEvent(moduleIndex, dayIndex)}>
                                        Add Event
                                    </PrimaryBtn>
                                </div>

                                </div>
                                </div>
                                    <PrimaryBtn
                                        onClick={(e) => {
                                            handleRemoveDay(moduleIndex, dayIndex);
                                        }}
                                        className="h-full"
                                        >
                                        Del
                                    </PrimaryBtn>
                                </div>
                            ))}
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <PrimaryBtn onClick={() => handleCreateNewDay(moduleIndex)}>
                                    Add Day
                                </PrimaryBtn>
                            </div>
                            </div>


                        </div>
                        <div className="flex justify-end">
                                    
                                    <button className="btn btn-square btn-outline">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                    </svg>
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
                        </div>
                    </div>
                </section>
            </div>
        </Page>
    );
}
