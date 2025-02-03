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
            <div className="modal-box flex flex-col items-center gap-4 p-16">
                <CloseBtn onClick={() => handleErrorModal()} position="absolute right-2 top-2"></CloseBtn>
                <div className="flex gap-4">
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={() => handleErrorModal()}>close</button>
            </form>
        </dialog>
    );
}