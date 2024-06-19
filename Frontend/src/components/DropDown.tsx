type Props = {
    modules: string[];
}

export default function DropDown({ modules }: Props) {
    return (
        <div className="flex flex-col justify-center">
            <select className="border border-gray-300 rounded-lg mt-2 max-w-xs p-1" >
                {modules.map(moduleName =>
                    <option value={moduleName}>{moduleName}</option>)}
            </select>

        </div>
    )
}