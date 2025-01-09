type Props = {
    onClick?: () => void;
    isPrevDisabled?: boolean
}

export default function PreviousBtn({ onClick, isPrevDisabled }: Props) {
    return (
            <button onClick={onClick} className={`btn btn-square ${isPrevDisabled && "disabled:bg-transparent"} bg-transparent focus:bg-transparent hover:bg-transparent active:bg-transparent shadow-none border-none flex min-h-10 h-10`} disabled={isPrevDisabled}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" strokeWidth="2" stroke="currentColor"><path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z" /></svg>
            </button>
    )

}