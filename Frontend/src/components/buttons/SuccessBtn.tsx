type Props = {
    value: string;
}

export default function SuccessBtn ({value}: Props) {
    return (
        <input type="submit" className="btn btn-sm mt-4 max-w-48 btn-success text-white" value={value} />
    )
}