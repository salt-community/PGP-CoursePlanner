type Props = {
    onClick?: () => void;
    children: React.ReactNode;
    color: string;
}

export default function ColorBtn({ onClick, children, color }: Props) {
    return (
        <button type="button" onClick={onClick} className="btn btn-sm max-w-48">
            {children}
            <div style={{ backgroundColor: color }} className="w-5 h-5"></div>
        </button>
    )
}