import { CalendarDateType } from "@models/calendar/Types";

export type Props = {
    modalData: CalendarDateType;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
};

export function DayModal({ modalData, onClose, onNext, onPrev, isPrevDisabled, isNextDisabled }: Props) {
    return (
        <>
            <dialog open className="modal">
                <div className="modal-box bg-base-100">
                    <div className="flex justify-between mb-4">
                        <button
                            onClick={onPrev}
                            className={`btn btn-outline ${isPrevDisabled ? "btn-disabled" : ""}`}
                            disabled={isPrevDisabled}
                        >
                            ← Previous Day
                        </button>
                        <button
                            onClick={onNext}
                            className={`btn btn-outline ${isNextDisabled ? "btn-disabled" : ""}`}
                            disabled={isNextDisabled}
                        >
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
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={onClose}>Close</button>
                    </form>

                </div>
            </dialog>
        </>
    );
}