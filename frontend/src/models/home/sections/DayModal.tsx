export type Props = {
    popUpId : string
} 

export function DayModal({popUpId} : Props) {


    {/* Open the modal using document.getElementById('ID').showModal() method */ }
    return (
        <>
            <dialog id={popUpId} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click outside to close</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}