import { CalendarDateType } from "@models/calendar/Types";

export type Props = {
    popUpId: string;
    modalData: CalendarDateType;
    onNext: () => void;
    onPrev: () => void;
};

export function DayModal({ popUpId, modalData, onNext, onPrev }: Props) {
    return (
        <>
            <dialog id={popUpId} className="modal ">
                <div className="modal-box bg-base-100">
                    <div className="flex justify-between mb-4">
                        <button onClick={onPrev} className="btn btn-outline">
                            ← Previous Day
                        </button>
                        <button onClick={onNext} className="btn btn-outline">
                            Next Day →
                        </button>
                    </div>
                    {modalData && modalData.dateContent.length > 0 ? (
                        modalData.dateContent.map((content, index) => (
                            <div key={content.id ?? index} className="mb-4 flex flex-col items-center">
                                <div>
                                    <p>
                                        Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                                    </p>
                                    {content.events.length > 0 ? (
                                        content.events.map((event) => (
                                            <div key={event.id ?? event.name} className="pb-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        style={{
                                                            width: "15px",
                                                            height: "15px",
                                                            backgroundColor: content.color,
                                                            borderRadius: "3px",
                                                        }}
                                                    ></div>
                                                    <p>{event.name}</p>
                                                    <p>
                                                        {event.startTime} - {event.endTime}
                                                    </p>
                                                </div>
                                                {event.description && (
                                                    <p className="pl-6 text-secondary">{event.description}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No events for this module.</p>
                                    )}
                                </div>
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