export type Day = {
    dayNumber: number;
    description: string;
    events: Event[];
}

export type DayProps = {
    dayNumber: number;
}