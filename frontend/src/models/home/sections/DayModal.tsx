import { useEffect } from "react";
import { CalendarDateType } from "@models/calendar/Types";
import PreviousBtn from "@components/buttons/PreviousBtn";
import NextBtn from "@components/buttons/NextBtn";
import CloseBtn from "@components/buttons/CloseBtn";

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
            <div className="modal-box bg-base-100 p-0 h-3/4 w-1/3">

                <div className="bg-primary w-full flex flex-col items-center p-3 ">

                    <div className="flex gap-6 mt-4 mb-4 items-center text-white">
                        <PreviousBtn onClick={onPrev} isPrevDisabled={isPrevDisabled} color="white" />
                        {modalData &&
                            <h3 className="text-2xl min-w-52 text-center">
                                {`${new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date(modalData.date))}`}
                            </h3>
                        }
                        <NextBtn onClick={onNext} isNextDisabled={isNextDisabled} color="white" />
                        <CloseBtn onClick={onClose} color="white" position="absolute right-2 top-2" hover="hover:bg-white hover:border-white"/>
                    </div>

                    <label className="flex flex-col ">
                        Filter Tracks
                        <select className="select select-bordered w-full max-w-xs">
                            <option disabled selected>All</option>
                            <option>Option</option>
                            <option>Option</option>
                        </select>
                    </label>

                </div>
                <div className="overflow-scroll">
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
        </div>
    );
}
