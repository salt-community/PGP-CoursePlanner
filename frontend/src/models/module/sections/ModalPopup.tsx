import { ReactNode } from "react";

type Props = {
    children: ReactNode
    setAllToFalse: () => void
}

export default function ModalPopup({ children, setAllToFalse }: Props) {

    function handleModal(state: string) {
        const modal = document.getElementById('modal-popup') as HTMLDialogElement;
        return state === "open"
            ? modal.showModal()
            : modal.close();
    }

    return (
        <>
            <button
                type="button"
                className="block w-full text-left px-4 py-2 text-sm"
                onClick={() => handleModal("open")}
            >
                Move Day to another Module
            </button>
            <dialog id="modal-popup" className="modal">
                <div className="modal-box flex flex-col items-center gap-4">
                    {children}
                    <button type="button" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => { handleModal("close"); setAllToFalse() }}>✕</button>
                </div>
                <div className="modal-backdrop">
                    <button type="button" onClick={() => { handleModal("close"); setAllToFalse() }}>close</button>
                </div>
            </dialog>
        </>
    );
}