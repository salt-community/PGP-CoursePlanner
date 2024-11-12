import { ReactNode } from "react";

type Props = {
    children: ReactNode
    setAllToFalse: () => void
    openModalText: string
}

export default function MoveModalContainer({ children, setAllToFalse, openModalText }: Props) {

    function handleModal(state: string) {
        const modal = document.getElementById('modal-popup') as HTMLDialogElement;
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
                    {openModalText}
            </li>
            <dialog id="modal-popup" className="modal">
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