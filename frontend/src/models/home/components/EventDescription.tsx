import { useEffect, useRef, useState } from "react";

type Prop = {
    description: string
}

export default function EventDescription({ description }: Prop) {
    const [expanded, setExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const refScrollHeight = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (refScrollHeight.current) {
            setShowReadMore(refScrollHeight.current.scrollHeight !== refScrollHeight.current.clientHeight);
        }
    }, [description]);

    return (
        <div className="pl-6">
            <div className="overflow-hidden" >
                <p ref={refScrollHeight} className={`overflow-hidden font-light ${!expanded && 'line-clamp-1'}`}>{description}</p>
            </div>
            {showReadMore &&
                <button
                    className="text-blue-800 min-w-fit"
                    onClick={() => setExpanded(!expanded)}>
                    {expanded ? ' Read Less' : 'Read More'}
                </button>
            }
        </div>
    )
}