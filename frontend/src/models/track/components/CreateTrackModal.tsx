import { useEffect, useState } from "react";
import CloseBtn from "@components/buttons/CloseBtn";
import SaveBtn from "@components/buttons/SaveBtn";
import AbortBtn from "@components/buttons/AbortBtn";
import { useMutationPostTrack } from "@api/track/trackMutations";
import { HexColorPicker } from "react-colorful";

type Props = {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateTrackModal({ openModal, setOpenModal }: Props) {
    const [modalState, setModalState] = useState(openModal);
    const [color, setColor] = useState("#000");
    const [name, setName] = useState("");
    const mutationPostTrack = useMutationPostTrack();

    function handleSubmit() {
        console.log(name, color)
        mutationPostTrack.mutate({
            name: name,
            color: color
        });
    }

    function handleModal() {
        setName("");
        setColor("#000");
        setModalState(false);
        setOpenModal(false);
    }

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <dialog className={`modal ${modalState ? "modal-open" : ""}`}>
            <div className="modal-box flex flex-col items-center p-0 bg-white">
                <div className="bg-[#ff7961] p-3 pt-6 pb-6 w-full flex flex-col items-center">
                    <h2 className="text-3xl font-semibold text-white p-5">Create Track</h2>
                </div>
                <CloseBtn onClick={() => handleModal()} color="white" position="absolute right-2 top-2" hover="hover:bg-white hover:border-white" />
                <form onSubmit={handleSubmit} className="flex flex-col gap-10 py-10 px-6">
                    <label className="text-lg font-medium">Track name:
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full" />
                    </label>
                    <label className="text-lg font-medium">Track color:
                        <HexColorPicker className="min-w-full" color={color} onChange={setColor} />
                    </label>
                    <div className="flex justify-between gap-4">
                        <SaveBtn onClick={() => { }} />
                        <AbortBtn onClick={() => handleModal()} />
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={() => handleModal()}>close</button>
            </form>
        </dialog>
    );
}