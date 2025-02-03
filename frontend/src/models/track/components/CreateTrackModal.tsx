import { useEffect, useState } from "react";
import CloseBtn from "@components/buttons/CloseBtn";
import SaveBtn from "@components/buttons/SaveBtn";
import AbortBtn from "@components/buttons/AbortBtn";
import { useMutationPostTrack } from "@api/track/trackMutations";
import { HexColorPicker } from "react-colorful";
import RequiredFormError from "./RequiredFormError";

type Props = {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateTrackModal({ openModal, setOpenModal }: Props) {
    const [modalState, setModalState] = useState(openModal);
    const [color, setColor] = useState("");
    const [name, setName] = useState("");
    const [req, setReq] = useState(false);
    const mutationPostTrack = useMutationPostTrack();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (name == "" || color == "") {
            setReq(true);
        } else {
            mutationPostTrack.mutate({
                name: name,
                color: color
            });
        }
    }

    function handleCloseModal() {
        setModalState(false);
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
        <dialog className={`modal ${modalState ? "modal-open" : ""}`}>
            <div className="modal-box flex flex-col items-center p-0 bg-white w-fit">
                <div className="bg-[#ff7961] p-3 pt-6 pb-6 w-full flex flex-col items-center">
                    <h2 className="text-3xl font-semibold text-white p-5">Create Track</h2>
                </div>
                <CloseBtn onClick={() => handleCloseModal()} color="white" position="absolute right-2 top-2" hover="hover:bg-white hover:border-white" />
                <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5 py-10 px-6">
                    <label className="text-lg font-medium">Track name*
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={`input input-bordered w-full ${(req && name === "") ? "input-error" : ""}`} />
                        {(req && name === "") &&
                            <RequiredFormError text="Please provide a name" />
                        }
                    </label>
                    <label className="text-lg font-medium">Track color*
                        <HexColorPicker className="min-w-full" color={color} onChange={setColor} />
                        {(req && name === "") &&
                            <RequiredFormError text="Please pick a color" />
                        }
                    </label>
                    <div className="flex justify-between gap-3 w-fit mt-6">
                        <SaveBtn />
                        <AbortBtn onClick={() => handleCloseModal()} />
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={() => handleCloseModal()}>close</button>
            </form>
        </dialog>
    );
}