type Props = {
    onClick: () => void;
}

export default function DeleteBtn({ onClick }: Props) {
    return (
        <button type="button" onClick={onClick} className="btn py-1 max-w-xs btn-error text-white min-w-52 text-xl">
            Delete
        </button>
    )
}