type Props = {
    onClick: () => void;
}

export default function PreviousBtn({ onClick }: Props) {
    return (
        <button type="button" onClick={onClick} className="btn btn-sm max-w-48 btn-primary">
            <button onClick={onClick} className="btn btn-square btn-outline">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </button>
    )
}