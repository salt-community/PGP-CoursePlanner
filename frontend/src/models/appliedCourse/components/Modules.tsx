import React, { useState } from "react";
import { CourseType, DayType } from "@models/course/Types";
import DotsIcon from "./DotsIcon";
import TrashIcon from "./TrashIcon";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import Days from "./Days";

interface ModulesProps {
  course: CourseType;
  setCourse: React.Dispatch<React.SetStateAction<CourseType>>;
  assignDatesToModules: (course: CourseType) => void;
}

const Modules = ({ course, setCourse, assignDatesToModules }: ModulesProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [collapseOpen, setCollapseOpen] = useState<Record<number, boolean>>({});

  const toggleCollapse = (index: number) => {
    setCollapseOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    assignDatesToModules(course)
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === targetIndex) return;

    setCourse((prevCourse) => {
      const updatedModules = [...prevCourse.modules];
      const [draggedModule] = updatedModules.splice(draggedIndex, 1);
      updatedModules.splice(targetIndex, 0, draggedModule);

      const reorderedModules = updatedModules.map((courseModule, index) => ({
        ...courseModule,
        module: {
          ...courseModule.module,
          order: index,
        },
      }));

      return {
        ...prevCourse,
        modules: reorderedModules,
      };
    });
    setDraggedIndex(targetIndex);
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
  const newDay: DayType = {
      id: 0,
      dayNumber: numberOfDays + 1,
      description: "New day",
      isApplied: true,
      events: [],
      date: new Date('2025-02-02').toISOString()
  };

  const updatedCourse = {
      ...course, 
      modules: course.modules.map((module, index) => {
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
      }),
  };
  assignDatesToModules(updatedCourse);
};



  return (
    <div>
      {course.modules
        .slice()
        .sort((a, b) => a.module.order - b.module.order)
        .map((courseModule, moduleIndex) => (
          <div
            key={moduleIndex}
            className={` flex space-between mb-4 rounded-r-lg border-r border-b border-gray-300 ${
              draggedIndex === moduleIndex ? "dragging" : ""
            }`}
            draggable={!collapseOpen[moduleIndex]} 
            onDragStart={() => handleDragStart(moduleIndex)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, moduleIndex)}
            style={{
              opacity: draggedIndex === moduleIndex ? 0.5 : 1,
              cursor: collapseOpen[moduleIndex] ? "default" : "move", 
            }}
          >
            <div className="collapse border-t border-l border-gray-300 rounded-none">
              <input
                type="checkbox"
                checked={!!collapseOpen[moduleIndex]}
                onChange={() => toggleCollapse(moduleIndex)}
              />
              <div className="collapse-title text-xl font-medium border-b border-gray-300">
                <div className="flex items-center">
                  <DotsIcon position="mr-1" size={6} />
                  {courseModule.module.name}
                </div>
              </div>
              {collapseOpen[moduleIndex] && (
                <div className="collapse-content max-w-full">
                  <div className="p-4">
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
