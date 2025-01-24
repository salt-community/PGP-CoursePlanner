import { useEffect, useState } from "react";
import CloseBtn from "@components/buttons/CloseBtn";

type Props = {
    warning: string
}

export default function DeleteWarningModal({ warning }: Props) {
    const [modalState, setModalState] = useState("open");

    function handleErrorModal() {
        setModalState("close");
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
    }, []);

    return (
        <>
            <dialog className={`modal ${modalState === "open" ? "modal-open" : ""}`}>
                <div className="modal-box flex flex-col items-center gap-4 p-16">
                    <CloseBtn onClick={() => handleErrorModal()} position="absolute right-2 top-2"></CloseBtn>
                    <h2 className="text-3xl font-semibold">
                        "Warning: Deleting this {warning} will permanently remove it from the system"
                    </h2>
                    <h3 className="text-lg">
                        Are you sure you want to proceed?
                    </h3>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-20 mt-4 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <div className="flex gap-4">
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            Delete
                        </button>
                        <button onClick={() => handleErrorModal()} className="btn btn-secondary">
                            Abort
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => handleErrorModal()}>
                        close
                    </button>
                </form>
            </dialog>
        </>
    );
}
