import { Fragment } from "react/jsx-runtime"
import VisibilityToggle from "./VisibilityToggle"

type Prop = {
    id: number,
    color: string,
    visibility: boolean,
    handleTrackVisibility: (id: number, visibility: boolean) => void
}

export default function VisibilityButton({ id, color, visibility, handleTrackVisibility }: Prop) {
    return (
        <Fragment>
            <button onClick={() => handleTrackVisibility(id, !visibility)} className="flex">
                <div className="m-1 mask rounded border-2 border-white" style={{ backgroundColor: color }}>
                    <VisibilityToggle visible={visibility} />
                </div>
            </button>
        </Fragment>
    )
}