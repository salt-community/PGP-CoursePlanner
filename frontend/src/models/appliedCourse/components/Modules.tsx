import React, { useState } from "react";
import { CourseType, DayType, ModuleType } from "@models/course/Types";
import DotsIcon from "./DotsIcon";
import TrashIcon from "./TrashIcon";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import Days from "./Days";
import { getNewDate } from "@models/course/helpers/courseUtils";

interface ModulesProps {
  course: CourseType;
  setCourse: React.Dispatch<React.SetStateAction<CourseType>>;
  assignDatesToModules: (course: CourseType) => void;
  handleMoveModule: (moduleId: number, newDate: string) => void;
}

const Modules = ({ course, setCourse, assignDatesToModules,handleMoveModule }: ModulesProps) => {
  const [collapseOpen, setCollapseOpen] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) => {
    setCollapseOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleRemoveModule = (index: number) => {
    setCourse((prevCourse) => {
      const updatedModules = prevCourse.modules.filter((_, i) => i !== index);
      const updatedCourse = {
        ...prevCourse,
        modules: updatedModules,
      };

      assignDatesToModules(updatedCourse);

      return updatedCourse;
    });
  };

  const handleCreateNewDay = (moduleIndex: number, numberOfDays: number) => {
    const myModule: ModuleType = {
      ...course.modules[moduleIndex].module,
      days: [...course.modules[moduleIndex].module.days], 
    };
  
    const newDay: DayType = {
      id: 0,
      dayNumber: numberOfDays + 1,
      description: "New day",
      isApplied: true,
      events: [],
      date: getNewDate(myModule.startDate, myModule.numberOfDays + 2),
    };
  
    myModule.days.push(newDay);
    myModule.numberOfDays += 1;
  
    const updatedCourse = {
      ...course,
      modules: course.modules.map((module, index) => {
        if (index === moduleIndex) {
          return {
            ...module,
            module: {
              ...myModule, 
            },
          };
        }
        return module;
      }),
    };
  
    assignDatesToModules(updatedCourse);
  };

  return (
    <div>
      {course.modules.map((courseModule, moduleIndex) => (
          <div
            key={moduleIndex}
            className={` flex space-between mb-4 rounded-r-lg border-r border-b border-gray-300`}
          >
            <div className="collapse border-t border-l border-gray-300 rounded-none">
              <input
                type="checkbox"
                checked={!!collapseOpen[moduleIndex]}
                onChange={() => toggleCollapse(moduleIndex)}
              />
              <div className="collapse-title text-xl font-medium border-b border-gray-300">
                <div className="flex items-center">
                  {courseModule.module.name}
                </div>
              </div>
              {collapseOpen[moduleIndex] && (
                <div className="collapse-content max-w-full">
                  <div className="p-4">
                    
                    <div>
                    <label>
                      Module Name:
                      <input
                        type="text"
                        value={courseModule.module.name}
                        onChange={(e) => {
                          const updatedModules = [...course.modules];
                          updatedModules[moduleIndex].module.name =
                            e.target.value;
                          setCourse({ ...course, modules: updatedModules });
                        }}
                        style={{ padding: "5px", border: "1px solid gray" }}
                      />
                    </label>
                      </div>
                      <div>
                      <input
                        type="date"
                        value={
                          courseModule.module.startDate 
                            ? new Date(courseModule.module.startDate).toISOString().split("T")[0] 
                            : ""
                        } 
                        onChange={(e) => {
                            const updatedModules = [...course.modules];
                            const updatedModule = { 
                                ...updatedModules[moduleIndex].module, 
                                startDate: new Date(e.target.value)
                            };

                            updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], module: updatedModule };
                            setCourse({ ...course, modules: updatedModules });
                            handleMoveModule(updatedModule.id, e.target.value);
                        }}
                    />
                  </div>
                  </div>
                  <Days
                    moduleIndex={moduleIndex}
                    courseModule={courseModule}
                    course={course}
                    setCourse={setCourse}
                    assignDatesToModules={assignDatesToModules}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <PrimaryBtn
                      onClick={() =>
                        handleCreateNewDay(
                          moduleIndex,
                          courseModule.module.numberOfDays
                        )
                      }
                    >
                      + Day
                    </PrimaryBtn>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end">
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
