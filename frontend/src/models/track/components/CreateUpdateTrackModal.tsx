import { useEffect, useState } from "react";
import CloseBtn from "@components/buttons/CloseBtn";
import SaveBtn from "@components/buttons/SaveBtn";
import AbortBtn from "@components/buttons/AbortBtn";
import { HexColorPicker } from "react-colorful";
import RequiredFormError from "./RequiredFormError";
import SubmitErrorMessage from "@components/SubmitErrorMessage";
import { TrackRequest } from "@api/Types";
import { UseMutationResult } from "@tanstack/react-query";

type Props = {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    prevColor?: string;
    prevName?: string;
    mutation: UseMutationResult<void, Error, TrackRequest, unknown>;
}

export default function CreateUpdateTrackModal({ openModal, setOpenModal, prevColor, prevName, mutation }: Props) {
    const [color, setColor] = useState(prevColor ? prevColor : "");
    const [name, setName] = useState(prevName ? prevName : "");
    const [req, setReq] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (name == "" || color == "" || (prevName == name && prevColor == color)) {
            setReq(true);
        } else {
            mutation.mutate({
                name: name,
                color: color
            }, {
                onError: (error) => {
                    if (error.message === "401") {
                        handleCloseModal();
                        window.location.reload()
                    }
                }
            });
        }
    }

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
        <dialog className={`modal ${openModal ? "modal-open" : ""}`}>
            <div className="modal-box flex flex-col items-center p-0 bg-white max-w-[460px]">
                <div className="bg-[#ff7961] p-3 pt-6 pb-6 w-full flex flex-col items-center">
                    <h2 className="text-3xl font-semibold text-white p-5">
                        {(prevName && prevColor) ? "Edit Track" : "Create Track"}
                    </h2>
                </div>
                <CloseBtn onClick={() => handleCloseModal()} color="white" position="absolute right-2 top-2" hover="hover:bg-white hover:border-white" />
                <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5 py-10 px-6 w-fit">
                    <label className="text-lg font-medium">
                        Track name*
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={`input input-bordered w-full ${(req && name === "") ? "input-error" : ""}`} />
                        {(req && (prevName === name || name === "")) &&
                            <RequiredFormError text={prevName ? "Please provide a different name" : "Please provide a name"} />
                        }
                    </label>
                    <label className="text-lg font-medium">
                        Track color*
                        <HexColorPicker className="min-w-full" color={color} onChange={setColor} />
                        {(req && (prevColor === color || color === "")) &&
                            <RequiredFormError text={prevColor ? "Please pick a different color" : "Please pick a color"} />
                        }
                    </label>
                    <div className="flex justify-between gap-3 mt-6">
                        <SaveBtn />
                        <AbortBtn onClick={() => handleCloseModal()} />
                    </div>
                    {mutation.isError &&
                        <SubmitErrorMessage statusCode={mutation.error.message} />
                    }
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={() => handleCloseModal()}>close</button>
            </form>
        </dialog>
    );
}