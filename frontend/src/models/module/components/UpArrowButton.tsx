type Props = {
    onClick: () => void
}

export default function UpArrowButton({ onClick }: Props) {
    return (
        <button
            type="button"
            className="w-full h-full self-center stroke-base-content"
            onClick={onClick}
        >
            <svg
                className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    )
}