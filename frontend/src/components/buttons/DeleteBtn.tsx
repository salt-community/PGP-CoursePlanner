type Props = {
    onClick: () => void;
    children: React.ReactNode;
}

export default function DeleteBtn({ onClick, children }: Props) {
    return (
        <button type="button" onClick={onClick} className="btn py-1 max-w-xs btn-error text-white min-w-60 text-xl">
            {children}
        </button>
    )
}