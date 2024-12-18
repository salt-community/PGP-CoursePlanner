import { useEffect } from "react";
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
    // Close modal when clicking on the backdrop
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).classList.contains("modal")) {
            onClose();
        }
    };

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);


    return (
        <div
            className="modal modal-open"
            onClick={handleBackdropClick}
        >
            <div className="modal-box bg-base-100 relative p-0">

                <div className="bg-primary w-full flex flex-col items-center gap-4">

                    <div className="flex gap-2 mb-4 items-center">
                        <button
                            onClick={onPrev}
                            className={`btn ${isPrevDisabled ? "btn-disabled" : ""}`}
                            disabled={isPrevDisabled}
                        >
                            ←
                        </button>
                        { modalData && <h3 className="text-xl">
                            {`${new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date(modalData.date))}`}
                        </h3> }
                        <button
                            onClick={onNext}
                            className={`btn ${isNextDisabled ? "btn-disabled" : ""}`}
                            disabled={isNextDisabled}
                        >
                            →
                        </button>
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                        >
                            ✕
                        </button>
                    </div>

                    <label className="flex flex-col ">
                        Filter Tracks
                        <select className="select select-bordered w-full max-w-xs">
                            <option disabled selected>All</option>
                            <option>Han Solo</option>
                            <option>Greedo</option>
                        </select>
                    </label>

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
        </div>
    );
}
