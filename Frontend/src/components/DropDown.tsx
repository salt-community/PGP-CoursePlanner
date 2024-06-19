type Props = {
    modules: string[];
}

export default function DropDown({ modules }: Props) {
    return (
        <div className="flex flex-col justify-center">
            <select className="border border-black rounded-md mt-2" >
                {modules.map(moduleName =>
                    <option value={moduleName}>{moduleName}</option>)}
            </select>

        </div>
    )
}