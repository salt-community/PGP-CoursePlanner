import { useEffect, useState } from "react";
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
    const [expanded, setExpanded] = useState(false);
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
            <div className="modal-box rounded-xl bg-base-100 p-0 h-3/4 max-w-lg">

                <div className="bg-[#ff7961] p-3 pt-6 pb-6 w-full flex flex-col items-center sticky top-0">
                    <div className="flex gap-6 mt-4 mb-4 items-center text-white">
                        <PreviousBtn onClick={onPrev} isPrevDisabled={isPrevDisabled} color="white" />
                        {modalData &&
                            <h3 className="text-2xl min-w-52 text-center">
                                {`${new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date(modalData.date))}`}
                            </h3>
                        }
                        <NextBtn onClick={onNext} isNextDisabled={isNextDisabled} color="white" />
                        <CloseBtn onClick={onClose} color="white" position="absolute right-2 top-2" hover="hover:bg-white hover:border-white" />
                    </div>
                </div>
                <div className="p-6">
                    {modalData && modalData.dateContent.length > 0 ? (
                        modalData.dateContent.map((content, index) => (
                            <div key={content.id ?? index} className="mb-4 flex flex-col items-center">
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
                                                <div className="flex items-center gap-2 justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            style={{
                                                                width: "15px",
                                                                height: "15px",
                                                                backgroundColor: "#ff7961",
                                                                borderRadius: "3px",
                                                            }}>
                                                        </div>
                                                        <p>{event.name}</p>
                                                    </div>
                                                    <p>
                                                        {event.startTime} - {event.endTime}
                                                    </p>
                                                </div>
                                                {event.description && (
                                                    <div className={`max-h-48 overflow-hidden transition-all duration-500 ${expanded ? 'max-h-screen' : ''}`}>
                                                        <p className="pl-6 font-light">{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}</p>
                                                        <button
                                                            className="btn btn-primary btn-sm text-sm font-bold uppercase"
                                                            onClick={() => setExpanded(!expanded)}
                                                        >
                                                            {expanded ? 'Read Less' : 'Read More'}
                                                        </button>
                                                    </div>
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
