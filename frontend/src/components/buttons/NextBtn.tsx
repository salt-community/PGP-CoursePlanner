type Props = {
    onClick?: () => void;
}

export default function NextBtn({ onClick }: Props) {
    return (
            <button onClick={onClick} className="btn btn-square flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" strokeWidth="2" stroke="currentColor"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" /></svg>
            </button>
    )
}