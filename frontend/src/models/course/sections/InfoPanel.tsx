import { getDateAsString } from "@helpers/dateHelpers";
import { CourseType, ModuleType } from "../Types";
import { CalendarDateType } from "@models/calendar/Types";
import { SubmitHandler, useForm } from "react-hook-form";
import { EventType } from "@models/module/Types";
import { formatDateTime } from "../helpers/courseUtils";

type Props = {
    selectedDate: CalendarDateType
    selectedModule: ModuleType
    handleMoveModule: () => void
    course: CourseType
    setCourse: React.Dispatch<React.SetStateAction<CourseType>>
}


type Inputs = {
    name: string;
    description: string;
    start: string
    end: string
    isBelongingToModule: boolean
};


export function InfoPanel({ selectedDate, handleMoveModule, selectedModule, course, setCourse }: Props) {

    const {
        register,
        handleSubmit,
        // watch,
        // formState: { errors },
    } = useForm<Inputs>()

const onSubmit: SubmitHandler<Inputs> = (data) => {
  const newEvent: EventType = {
    id: 0, 
    name: data.name,
    startTime: data.start,
    endTime: data.end,
    description: data.description,
    isApplied: true,
  };

  if (data.isBelongingToModule) {
    const updatedModules = course.modules.map((module) => {
      if (module.module.id === selectedModule.id) {
        const updatedDays = module.module.days.map((day) => {
          if (getDateAsString(day.date) === getDateAsString(selectedDate.date)) {
            return {
              ...day,
              events: [...day.events, newEvent], 
            };
          }
          return day;
        });

        return {
          ...module,
          module: {
            ...module.module,
            days: updatedDays,
          },
        };
      }
      return module;
    });

    const updatedCourse: CourseType = {
      ...course,
      modules: updatedModules,
    };

    setCourse(updatedCourse);

    console.log("Updated course with new event:", updatedCourse);
  } else {
    const miscEvents : EventType[]= course.miscellaneousEvents
    newEvent.startTime =formatDateTime(selectedDate.date, newEvent.startTime)
    newEvent.endTime =formatDateTime(selectedDate.date, newEvent.endTime)

    miscEvents.push(newEvent);

    setCourse({...course, miscellaneousEvents: miscEvents})

  }
};





    return (
        <div className="p-4 ">
            {/* <EditCourseDays course={previewCourse} setCourse={setCourse} /> */}

            <div>
                {selectedDate.dateContent.map((content, index) => {

                    return (
                        <div key={index} className="mb-4 flex flex-col ">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {content.courseName}
                                </h2>
                                <h3 className="text-lg pb-2">
                                    {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                                </h3>
                                {content.events.length > 0 ? (
                                    content.events.map((event) => (
                                        <div key={event.id ?? event.name} className="pb-2 mb-2 w-2/5">
                                            <div className="flex  gap-2 justify-between min-w-96">
                                                <div className="flex  gap-2">
                                                    <div className="w-4 h-4 rounded-[3px]" style={{ backgroundColor: `${content.color}` }}></div>
                                                    <p>{event.name}</p>
                                                </div>
                                                <p>
                                                    {event.startTime} - {event.endTime}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-lg">No events for this module.</p>
                                )}
                            </div>
                        </div>
                    )
                })}

            </div>

            <div className="flex flex-grow"></div>

            <details className="dropdown">
                <summary className="btn m-1">New event?</summary>
                <form>
                    <div className=" flex flex-col gap-3 p-5">
                        <select className="select select-bordered w-full max-w-xs">
                            <option disabled selected>event template</option>
                            <option>Han Solo</option>
                            <option>Greedo</option>
                        </select>

                        <label >Name<input type="text" {...register("name", { required: true })}></input></label>
                        <label >Description<input type="text" {...register("description", { required: true })}></input></label>
                        <label >Start<input type="time" {...register("start", { required: true })}></input></label>
                        <label >End<input type="time" {...register("end", { required: true })}></input></label>
                        <label>Belongs to module<input type="checkbox" {...register("isBelongingToModule")}></input></label>

                        <button className="btn" type="submit" onClick={handleSubmit(onSubmit)} > Add event </button>
                    </div>
                </form>
            </details>




            <button className="btn" onClick={(event) => {
                event.preventDefault()
                handleMoveModule()
            }}>Set {selectedModule.name} start date to {getDateAsString(selectedDate.date)} </button>


        </div>
    )
}