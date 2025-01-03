export function openCloseModal(state: string, setAllToFalse: () => void, id: string) {
    const modal = document.getElementById(`modal-popup-${id}`) as HTMLDialogElement;
    if (state === "open") {
        modal.showModal();
    } else {
        modal.close();
        setAllToFalse();
    }
}