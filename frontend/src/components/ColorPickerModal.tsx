import ColorBtn from "./buttons/ColorButton";
import ColorSelection from "./ColorSelection";

type Props = {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>
}
export default function ColorPickerModal({ color, setColor }: Props) {

    function handleColorModal(state: string) {
        const modal = document.getElementById('color-modal') as HTMLDialogElement;
        return state === "open"
            ? modal.showModal()
            : modal.close();
    }

    return (
        <>
            <ColorBtn color={color} onClick={() => handleColorModal("open")}>Select color</ColorBtn>
            <dialog id="color-modal" className="modal">
                <div className="modal-box flex flex-col items-center gap-4">
                    <ColorSelection color={color} setColor={setColor}></ColorSelection>
                    <ColorBtn onClick={() => handleColorModal("close")} color={color}>Select color</ColorBtn>
                    <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => { handleColorModal("close"); setColor("#FFFFFF") }}>✕</button>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setColor("#FFFFFF")}>close</button>
                </form>
            </dialog>
        </>
    );
}