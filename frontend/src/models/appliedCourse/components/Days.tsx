import { CourseModuleType, CourseType } from "@models/course/Types";
import DotsIcon from "./DotsIcon";
import TrashIcon from "./TrashIcon";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import React from "react";

    interface DaysProps {
        course: CourseType;
        setCourse: React.Dispatch<React.SetStateAction<CourseType>>;
        courseModule: CourseModuleType;
        moduleIndex: number;
    }
  
  const Days = ({ course, setCourse, courseModule,moduleIndex }: DaysProps) => {

    const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

    const handleDragStart = (dayIndex: number) => {
        setDraggedIndex(dayIndex);
      };
    
      const handleDragEnd = () => {
        setDraggedIndex(null);
      };
    
      const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
    
        if (draggedIndex === null || draggedIndex === targetIndex) return;
    
        setCourse((prevCourse) => {
            const updatedModules = [...prevCourse.modules];
            
            const targetModule = { ...updatedModules[moduleIndex].module };
            const days = [...targetModule.days];
    
            const [draggedDay] = days.splice(draggedIndex, 1);
            days.splice(targetIndex, 0, draggedDay);
            
            days.forEach((day, index) =>{
                day.dayNumber = index +1;
            })
            targetModule.days = days;
            updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], module: targetModule };
    
            return {
                ...prevCourse,
                modules: updatedModules,
            };
        });
    
        setDraggedIndex(targetIndex);
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

    return(
        <>
        {courseModule.module.days.map((day, dayIndex) => (
        <div
        key={dayIndex}
        className={`bg-base-200 flex space-between border border-black mb-4 rounded-r-lg ${
            draggedIndex === dayIndex ? "dragging" : ""
        }`}
        draggable
        onDragStart={() => handleDragStart(dayIndex)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, dayIndex)}
        style={{
            opacity: draggedIndex === dayIndex ? 0.5 : 1,
            cursor: "move",
        }}
        >
        <div className="collapse">
            <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">
                    <div className="flex items-center">
                        <DotsIcon position="mr-1" size={6} />
                        Day {dayIndex + 1} {day.description}
                    </div>
                </div>
            <div className="collapse-content border-t border-black rounded-none overflow-y-auto flex flex-col">
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
                        className="flex flex-wrap items-center justify-between gap-4 mt-4 p-4 border-b border-gray-300 rounded-md"
                    >
                        <div className="flex flex-wrap gap-4 w-full">
                            <button onClick={() => handleRemoveEvent(moduleIndex, dayIndex, eventIndex)} className="btn btn-square btn-outline scale-75">
                                <TrashIcon size={6} />
                            </button>
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
                    </div>
                ))}
                <div className="mt-auto">
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
        </>
    )
  }

  export default Days;
