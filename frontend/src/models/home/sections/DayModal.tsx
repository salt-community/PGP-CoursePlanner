import { CalendarDateType } from "@models/calendar/Types";

export type Props = {
    popUpId: string;
    modalData: CalendarDateType;
};

export function DayModal({ popUpId, modalData }: Props) {

    console.log(modalData)

    return (
        <>
            <dialog id={popUpId} className="modal">
                <div className="modal-box">
                    {/* <h2 className="text-lg font-bold">Date: {modalData.date.toDateString()}</h2> */}
                    {modalData && modalData.dateContent != null ? (
                        modalData.dateContent.map((content, index) => (                    
                            <div key={content.id ?? index} className="mb-4">
                                <h3 className="text-md font-semibold">
                                    Module: {content.moduleName ?? "No Module Name"}
                                </h3>
                                <p>Course Name: {content.courseName}</p>
                                <p>Day of Module: {content.dayOfModule} / {content.totalDaysInModule}</p>
                                <div className="pl-4">
                                    {content.events.length > 0 ? (
                                        content.events.map((event) => (
                                            <div key={event.id ?? event.name} className="border-b pb-2 mb-2">
                                                <p>
                                                    <strong>Event Name:</strong> {event.name}
                                                </p>
                                                <p>
                                                    <strong>Start Time:</strong> {event.startTime}
                                                </p>
                                                <p>
                                                    <strong>End Time:</strong> {event.endTime}
                                                </p>
                                                {event.description && (
                                                    <p>
                                                        <strong>Description:</strong> {event.description}
                                                    </p>
                                                )}
                                                <p>
                                                    <strong>Applied:</strong>{" "}
                                                    {event.isApplied ? "Yes" : "No"}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No events for this module.</p>
                                    )}
                                </div>
                                <p style={{ color: content.color }}>
                                    Module Color: {content.color}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No content available for this date.</p>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    );
}