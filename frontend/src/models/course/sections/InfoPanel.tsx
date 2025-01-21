import { getDateAsStringYyyyMmDd } from "@helpers/dateHelpers";
import { CalendarDateType, ModuleType } from "../Types";

type Props = {
    selectedDate: CalendarDateType
    selectedModule: ModuleType
    handleMoveModule: () => void
}

export function InfoPanel({ selectedDate, selectedModule, handleMoveModule }: Props) {

    return (
        <div className="p-4">
            {/* <EditCourseDays course={previewCourse} setCourse={setCourse} /> */}
            <div >
                <h3 className="font-bold">Change start date of module</h3>
                <p>Selected module: {selectedModule.name} </p>
                <p>current start: {getDateAsStringYyyyMmDd(selectedModule.startDate)} </p>
                <p>new start: {getDateAsStringYyyyMmDd(selectedDate.date)}</p>
                <button className="btn" onClick={(event) => {
                    event.preventDefault()
                    handleMoveModule()
                }}>update module start date</button>
            </div>
            <div>
                <h4 className="font-bold pt-6">selected day's events </h4>
                {selectedDate.dateContent.map((content, index) => {

                    return (
                        <div key={index} className="mb-4 flex flex-col items-center">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {content.courseName}
                                </h2>
                                <h3 className="text-lg pb-2">
                                    Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                                </h3>
                                {content.events.length > 0 ? (
                                    content.events.map((event) => (
                                        <div key={event.id ?? event.name} className="pb-2 mb-2">
                                            <div className="flex items-center gap-2 justify-between min-w-96">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-[3px]" style={{ backgroundColor: `${content.color}` }}></div>
                                                    <p>{event.name}</p>
                                                </div>
                                                <p>
                                                    {event.startTime} - {event.endTime}
                                                </p>
                                            </div>
                                            {/* {event.description && (
                                                            <EventDescription description={event.description} />
                                                        )} */}
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
        </div>
    )
}