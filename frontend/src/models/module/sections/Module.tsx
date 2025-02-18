import { useState } from "react";
import { useQueryTracks } from "@api/track/trackQueries";
import { useMutationPostModule, useMutationUpdateModule } from "@api/module/moduleMutations";
import { DayType, ModuleType, Track } from "@api/Types";
import TrashIcon from "@models/course/components/TrashIcon";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import DotsIcon from "@models/appliedCourse/components/DotsIcon";

type ModuleProps = {
  buttonText: string;
};

export default function Module({ buttonText }: ModuleProps) {
  const [newModule, setNewModule] = useState<ModuleType>({
    name: "New Module",
    numberOfDays: 0,
    days: [],
    tracks: [],
    order: 1,
    creationDate: new Date()
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [collapseOpen, setCollapseOpen] = useState<Record<number, boolean>>({});
  const { data: trackData, isLoading: isLoadingTracks, isError: isErrorTracks } = useQueryTracks();

  const { mutate: createModule } = useMutationPostModule();
  const { mutate: updateModule } = useMutationUpdateModule("/modules");

  const handleSubmitModule = () => {
    if (false) {
      console.log(newModule);
      updateModule(newModule);
    } else {
      console.log(newModule);
      createModule(newModule);
    }
  };

  function addButton() {
    const newDay: DayType = {
      dayNumber: newModule.numberOfDays + 1,
      description: "New Day",
      events: [],
      date: new Date(),
    };
    setNewModule((prevModule) => ({
      ...prevModule,
      days: [...prevModule.days, newDay],
      numberOfDays: prevModule.numberOfDays + 1,
    }));
  }

  const toggleCollapse = (index: number) => {
    setCollapseOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleDragStart = (dayIndex: number) => {
    setDraggedIndex(dayIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === targetIndex) return;

    setNewModule((prevModule) => {
      const updatedDays = [...prevModule.days];
      const [draggedDay] = updatedDays.splice(draggedIndex, 1);
      updatedDays.splice(targetIndex, 0, draggedDay);

      updatedDays.forEach((day, index) => {
        day.dayNumber = index + 1;
      });

      return {
        ...prevModule,
        days: updatedDays,
      };
    });

    setDraggedIndex(targetIndex);
  };

  const handleCreateNewEvent = (dayIndex: number) => {
    const newEvent = {
        name: "New Event",
        startTime: "00:00",
        endTime: "00:00",
        description: "",
    };

    setNewModule((prevModule) => ({
        ...prevModule,
        days: prevModule.days.map((day, index) => 
            index === dayIndex
                ? { ...day, events: [...day.events, newEvent] }
                : day
        ),
    }));
};

  const handleRemoveEvent = (dayIndex: number, eventIndex: number) => {
    setNewModule((prevModule) => {
      const updatedDays = [...prevModule.days];
      updatedDays[dayIndex].events = updatedDays[dayIndex].events.filter(
        (_, eIndex) => eIndex !== eventIndex
      );

      return {
        ...prevModule,
        days: updatedDays,
      };
    });
  };

  const handleRemoveDay = (dayIndex: number) => {
    setNewModule((prevModule) => {
      const updatedDays = prevModule.days.filter((_, index) => index !== dayIndex);
      return {
        ...prevModule,
        days: updatedDays,
        numberOfDays: updatedDays.length,
      };
    });
  };

  const handleModuleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewModule((prevModule) => ({
      ...prevModule,
      name: e.target.value,
    }));
  };

  const handleTrackSelection = (track: Track, isChecked: boolean) => {
    setNewModule((prevModule) => {
      const updatedTracks = isChecked
        ? [...prevModule.tracks, track]  
        : prevModule.tracks.filter((t) => t.id !== track.id); 

      return {
        ...prevModule,
        tracks: updatedTracks,
      };
    });
  };

  return (
    <section className="p-6 md:px-24 lg:px-56">
      <label>
        module name:
      <input
        type="text"
        value={newModule.name}
        onChange={handleModuleNameChange}
        placeholder="Module Name"
        className="input input-bordered w-full mb-4"
      />
      </label>
      
      {isLoadingTracks ? (
        <p>Loading tracks...</p>
      ) : isErrorTracks ? (
        <p className="text-error">Error loading tracks.</p>
      ) : (
        <div className="mb-4">
        <p>Select tracks</p>
        <div className="flex flex-wrap gap-4">
          {trackData?.map((track, index) => (
            <label key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newModule.tracks.some((t) => t.id === track.id)}
                onChange={(e) => handleTrackSelection(track, e.target.checked)}
                className="checkbox"
              />
              {track.name}
            </label>
          ))}
        </div>
      </div>
      )}

      {newModule.days.map((day, dayIndex) => (
        <div
          key={dayIndex}
          className={"bg-base-100 flex space-between border border-black mb-4 rounded-r-lg"}
          draggable={!collapseOpen[dayIndex]} 
          onDragStart={() => handleDragStart(dayIndex)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, dayIndex)}
          style={{ opacity: draggedIndex === dayIndex ? 0.5 : 1 }}
        >
          <div className="collapse">
          <input type="checkbox" checked={collapseOpen[dayIndex]} onChange={() => toggleCollapse(dayIndex)} className="collapse-toggle" />
          <div className="collapse-title text-xl font-medium">
                    <div className="flex items-center">
                        <DotsIcon position="mr-1" size={6} />
                        Day {dayIndex + 1} {day.description}
                    </div>
                </div>
          <div className="collapse-content">
            <label>
              Name of day:
            <input
              type="text"
              value={day.description}
              onChange={(e) => {
                const updatedDays = [...newModule.days];
                updatedDays[dayIndex].description = e.target.value;
                setNewModule({ ...newModule, days: updatedDays });
              }}
              className="p-2 border border-gray-300 rounded-md"
            />
            </label>
            {day.events.map((event, eventIndex) => (
              <div key={eventIndex} className="flex items-center gap-2 border-b py-2">
                <button onClick={() => handleRemoveEvent(dayIndex, eventIndex)} className="btn btn-square btn-outline scale-75">
                  <TrashIcon size={6} />
                </button>

                <label className="flex flex-col">
                    Event Name:
                    <input
                        type="text"
                        value={event.name}
                        onChange={(e) => {
                            const updatedDays = [...newModule.days];
                            updatedDays[dayIndex].events[eventIndex].name = e.target.value;
                            setNewModule({ ...newModule, days: updatedDays });
                        }}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </label>

                <label className="flex flex-col">
                Event description:
                <input
                  type="text"
                  value={event.description}
                  onChange={(e) => {
                    const updatedDays = [...newModule.days];
                    updatedDays[dayIndex].events[eventIndex].description = e.target.value;
                    setNewModule({ ...newModule, days: updatedDays });
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
                        const updatedDays = [...newModule.days];
                        updatedDays[dayIndex].events[eventIndex].startTime = e.target.value;
                        setNewModule({ ...newModule, days: updatedDays });
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
                        const updatedDays = [...newModule.days];
                        updatedDays[dayIndex].events[eventIndex].endTime = e.target.value;
                        setNewModule({ ...newModule, days: updatedDays });
                      }}
                      className="p-2 border border-gray-300 rounded-md"
                  />
              </label>
              </div>
            ))}
            <div className="mt-auto">
                                <PrimaryBtn onClick={() => handleCreateNewEvent(dayIndex)}>
                                    + Event
                                </PrimaryBtn>
                            </div>
          </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => handleRemoveDay(dayIndex)} className="btn btn-square btn-outline h-[61px] w-[61px] rounded-none rounded-r-lg">
              <TrashIcon size={6} />
            </button>
          </div>
        </div>
        
      ))}

      <button onClick={addButton} className="btn btn-primary w-20 mb-16">
        + Day
      </button>
      <button onClick={handleSubmitModule} className="btn btn-success w-full">
        { buttonText|| "Submit Module"}
      </button>
      
    </section>
  );
}
