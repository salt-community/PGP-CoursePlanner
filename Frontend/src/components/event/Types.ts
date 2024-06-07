export type Event = {
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
    links?: string[];
}

export type EventProps = {
    setEventArr: React.Dispatch<React.SetStateAction<number[]>>;
    eventArr: number[];
    index: number;
}