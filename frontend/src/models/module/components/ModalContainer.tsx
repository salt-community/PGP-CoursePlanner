import { ReactNode } from "react";

type Props = {
    children: ReactNode
    setAllToFalse: () => void
    openModalText: string
    dayIndex: number
}

export default function ModalContainer({ children, setAllToFalse, openModalText, dayIndex }: Props) {

    function handleModal(state: string) {
        const modal = document.getElementById(`modal-popup-${dayIndex}`) as HTMLDialogElement;
        if (state === "open") {
            modal.showModal();
        } else {
            modal.close();
            setAllToFalse();
        }
    }

    return (
        <>
            <li
                onClick={() => handleModal("open")}
            >
                <a>{openModalText}</a>
            </li>
            <dialog id={`modal-popup-${dayIndex}`} className="modal">
                <div className="modal-box flex flex-col items-center gap-4">
                    {children}
                    <button type="button" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => handleModal("close")}>✕</button>
                </div>
                <div className="modal-backdrop">
                    <button type="button" onClick={() => handleModal("close")}>close</button>
                </div>
            </dialog>
        </>
    );
}