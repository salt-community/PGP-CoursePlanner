type Props = {
    onClick?: () => void;
    isNextDisabled?: boolean
    color?: string
}

export default function NextBtn({ onClick, isNextDisabled, color }: Props) {
    return (
        <button onClick={onClick} className={`btn btn-square ${isNextDisabled && "disabled:bg-transparent"} bg-transparent focus:bg-transparent hover:bg-transparent  active:bg-transparent shadow-none border-none flex min-h-10 h-10`} disabled={isNextDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" strokeWidth="2" stroke={isNextDisabled ? "gray" : (color ? color : "currentColor")}><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" /></svg>
        </button>
    )
}