import { useEffect } from "react";
import CloseBtn from "@components/buttons/CloseBtn";

type Props = {
    openModal: boolean
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    warning: string
    handleDelete: () => void
}

export default function DeleteWarningModal({ openModal, setOpenModal, warning, handleDelete }: Props) {

    function handleCloseModal() {
        setOpenModal(false);
    }

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleCloseModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <>
            <dialog className={`modal ${openModal ? "modal-open" : ""} rounded`}>
                <div className="modal-box flex flex-col items-center gap-4 p-16 pt-10">
                    <CloseBtn onClick={() => handleCloseModal()} position="absolute right-2 top-2"></CloseBtn>
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-red-500 pb-4">
                            Warning
                        </h2>
                        <p className="text-lg">
                            Deleting this {warning} will permanently remove it from the system.
                        </p>
                        <p className="text-xl font-semibold pt-4">
                            Are you sure you want to proceed?
                        </p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-20 mt-4 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <div className="flex gap-4 w-full">
                        <button onClick={handleDelete} className="btn btn-primary min-w-48">
                            Delete
                        </button>
                        <button onClick={() => handleCloseModal()} className="btn btn-secondary min-w-48">
                            Abort
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => handleCloseModal()}>
                        close
                    </button>
                </form>
            </dialog>
        </>
    );
}
