import { useEffect, useState } from "react";
import CloseBtn from "@components/buttons/CloseBtn";

type Props = {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateTrackModal({ openModal, setOpenModal }: Props) {
    const [modalState, setModalState] = useState(openModal);

    function handleErrorModal() {
        setModalState(false);
        setOpenModal(false);
    }

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleErrorModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <dialog className={`modal ${modalState ? "modal-open" : ""}`}>
            <div className="modal-box flex flex-col items-center p-0">
                <div className="bg-[#ff7961] p-3 pt-6 pb-6 w-full flex flex-col items-center">
                    <h2 className="text-3xl font-semibold text-white p-5">Create Track</h2>
                </div>
                <CloseBtn onClick={() => handleErrorModal()} color="white" position="absolute right-2 top-2" hover="hover:bg-white hover:border-white" />
                <div className="flex gap-4 p-3 pt-6">
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={() => handleErrorModal()}>close</button>
            </form>
        </dialog>
    );
}