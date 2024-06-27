type Props = {
    onClick: () => void;
}

export default function PreviousBtn({ onClick }: Props) {
    return (
        <button type="button" onClick={onClick} className="btn btn-sm max-w-48 btn-primary">
            <button onClick={onClick} className="btn btn-square btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z" /></svg>
            </button>
        </button>
    )

}