type Props = {
    onClick: () => void;
    children: React.ReactNode;
}

export default function PrimaryBtn({ onClick, children }: Props) {
    return (
        <button type="button" onClick={onClick} className="btn btn-sm max-w-48 btn-primary">
            {children}
        </button>
    )
}