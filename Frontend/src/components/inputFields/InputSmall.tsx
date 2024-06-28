type Props = {
    name: string;
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputSmall ({name, value, type, placeholder, onChange}: Props) {
    return (
        <input onChange={onChange} name={name} value={value} type={type} placeholder={placeholder} className="input input-bordered w-full input-sm" />
    )
}