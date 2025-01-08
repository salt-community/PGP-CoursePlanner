import {CourseType, DayType } from '@models/course/Types';
import React from 'react';
import DotsIcon from './DotsIcon';
import TrashIcon from './TrashIcon';
import PrimaryBtn from '@components/buttons/PrimaryBtn';
import Days from './Days';

    interface ModulesProps {
        course: CourseType;
        setCourse: React.Dispatch<React.SetStateAction<CourseType>>;
    }
  
  const Modules = ({ course, setCourse }: ModulesProps) => {

        const handleRemoveModule = (index: number) => {
            setCourse((prevCourse) => ({
                ...prevCourse,
                modules: prevCourse.modules.filter((_, i) => i !== index),
            }));
        };  
        const handleCreateNewDay = (moduleIndex: number, numberOfDays: number) => {
            const newDay: DayType = {
                id: 0,
                dayNumber: numberOfDays + 1,
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
  return (
    <div>
      {course.modules.map((courseModule, moduleIndex) => (
        <div className="bg-base-100 flex space-between mb-4 rounded-r-lg border-r border-b border-black" key={moduleIndex}>
        <div className="collapse border-t border-r border-l border-black rounded-none">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium border-b border-black">
                <div className="flex items-center">
                    <DotsIcon position="mr-1" size={6} />
                    {courseModule.module.name}
                </div>
            </div>
            <div className="collapse-content max-w-full">

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
            <Days moduleIndex={moduleIndex} courseModule={courseModule} course={course} setCourse={setCourse} />
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <PrimaryBtn onClick={() => handleCreateNewDay(moduleIndex, courseModule.module.numberOfDays)}>
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
    </div>
  );
};

export default Modules;
