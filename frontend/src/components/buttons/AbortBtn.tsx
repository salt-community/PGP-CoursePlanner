type Props = {
    onClick: () => void
}

export default function DeleteBtn({ onClick }: Props) {
    return (
        <button type="button" onClick={onClick} className="btn btn-secondary min-w-52 text-xl">Abort</button>
    )
}