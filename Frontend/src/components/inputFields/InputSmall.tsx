type Props = {
    name: string;
    value: string;
    type: string;
    placeholder: string;
    onChange?: () => void;
}

export default function InputSmall ({name, value, type, placeholder, onChange}: Props) {
    return (
        <input onChange={onChange} name={name} value={value} type={type} placeholder={placeholder} className="input input-bordered w-full input-sm max-w-xs " />
    )
}