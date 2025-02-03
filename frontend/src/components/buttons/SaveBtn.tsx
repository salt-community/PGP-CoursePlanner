type Props = {
    onClick: () => void
}

export default function SaveBtn({ onClick }: Props) {
    return (
        <button onClick={onClick} type="submit" className="btn btn-primary text-xl min-w-40">Save</button>
    )
}