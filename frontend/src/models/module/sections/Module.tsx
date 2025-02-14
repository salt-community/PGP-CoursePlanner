import { useState } from "react";
import { DayType, ModuleProps, ModuleType, Track } from "@models/course/Types";
import { useQueryTracks } from "@api/track/trackQueries";
import { useMutationPostModule, useMutationUpdateModule } from "@api/module/moduleMutations";

export default function Module({ buttonText }: ModuleProps) {
  const [newModule, setNewModule] = useState<ModuleType>({
    name: "New Module",
    numberOfDays: 0,
    days: [],
    tracks: [],
    order: 1
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
      <input
        type="text"
        value={newModule.name}
        onChange={handleModuleNameChange}
        placeholder="Module Name"
        className="input input-bordered w-full mb-4"
      />
      
      {isLoadingTracks ? (
        <p>Loading tracks...</p>
      ) : isErrorTracks ? (
        <p className="text-error">Error loading tracks.</p>
      ) : (
        <div className="mb-4">
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
      )}

      {newModule.days.map((day, dayIndex) => (
        <div
          key={dayIndex}
          className="collapse collapse-arrow bg-base-100 border border-base-300 mb-4"
          draggable
          onDragStart={() => handleDragStart(dayIndex)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, dayIndex)}
          style={{ opacity: draggedIndex === dayIndex ? 0.5 : 1 }}
        >
          <input type="checkbox" checked={collapseOpen[dayIndex]} onChange={() => toggleCollapse(dayIndex)} className="collapse-toggle" />
          <div className="collapse-title text-xl font-medium cursor-pointer">
            {day.description}
          </div>
          <div className="collapse-content">
            <input
              type="text"
              value={day.description}
              onChange={(e) => {
                const updatedDays = [...newModule.days];
                updatedDays[dayIndex].description = e.target.value;
                setNewModule({ ...newModule, days: updatedDays });
              }}
              className="input input-bordered w-full mb-2"
            />
            {day.events.map((event, eventIndex) => (
              <div key={eventIndex} className="flex items-center gap-2 border-b py-2">
                <input
                  type="text"
                  value={event.description}
                  onChange={(e) => {
                    const updatedDays = [...newModule.days];
                    updatedDays[dayIndex].events[eventIndex].description = e.target.value;
                    setNewModule({ ...newModule, days: updatedDays });
                  }}
                  className="input input-bordered w-full"
                />
                <button
                  onClick={() => handleRemoveEvent(dayIndex, eventIndex)}
                  className="btn btn-error btn-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => handleCreateNewEvent(dayIndex)}
              className="btn btn-accent btn-sm mt-2"
            >
              + Add Event
            </button>
            <button
              onClick={() => handleRemoveDay(dayIndex)}
              className="btn btn-error btn-sm mt-2 ml-2"
            >
              Remove Day
            </button>
          </div>
        </div>
      ))}

      <button onClick={addButton} className="btn btn-primary w-full mb-4">
        + Add Day
      </button>
      <button onClick={handleSubmitModule} className="btn btn-success w-full">
        {buttonText || "Submit Module"}
      </button>
    </section>
  );
}
