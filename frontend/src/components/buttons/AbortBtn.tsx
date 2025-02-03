type Props = {
    onClick: () => void
}

export default function DeleteBtn({ onClick }: Props) {
    return (
        <button type="button" onClick={onClick} className="btn btn-secondary text-xl min-w-40">Abort</button>
    )
}