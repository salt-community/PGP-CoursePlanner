import { ReactNode } from "react";
import { openCloseModal } from "../helpers/openCloseModal";

type Props = {
    children: ReactNode
    setAllToFalse: () => void
    openModalText: string
    id: string
}

export default function ModalContainer({ children, setAllToFalse, openModalText, id }: Props) {
    return (
        <>
            <li
                onClick={() => openCloseModal("open", setAllToFalse, id)}
            >
                <a>{openModalText}</a>
            </li>
            <dialog id={`modal-popup-${id}`} className="modal">
                <div className="modal-box flex flex-col items-center gap-4">
                    {children}
                    <button type="button" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => openCloseModal("close", setAllToFalse, id)}>✕</button>
                </div>
                <div className="modal-backdrop">
                    <button type="button" onClick={() => openCloseModal("close", setAllToFalse, id)}>close</button>
                </div>
            </dialog>
        </>
    );
}