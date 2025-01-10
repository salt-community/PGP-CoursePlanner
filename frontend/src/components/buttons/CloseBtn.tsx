type Props = {
    onClick: () => void
    color?: string
    position?: string
}

export default function CloseBtn({ onClick, color, position }: Props) {
    return (
        <button onClick={onClick} className={`btn btn-sm btn-circle btn-outline border-${color} hover:border-${color} hover:bg-${color} ${position}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="p-1 hover:stroke-primary" fill="none" viewBox="0 0 24 24" stroke={color ? color : "currentColor"}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    )
}