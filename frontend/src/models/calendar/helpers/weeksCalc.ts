import { getWeek } from "date-fns";

export function weeksCalc(date: string): number {
    const monthIndex = parseInt(date.slice(0, 2)) - 1;
    const monthEndDay = parseInt(date.slice(3, 5));
    const year = parseInt(date.slice(6, 10));

    const weeks: number[] = [];
    if (getWeek(new Date(year, monthIndex, monthEndDay, 0, 0, 0, -1)) === 1) {
        for (let i = getWeek(new Date(year, monthIndex, 1, 0, 0, 0, -1)); i <= 52; i++) {
            weeks.push(i);
        }
        weeks.push(1)
    }
    else {
        for (let i = getWeek(new Date(year, monthIndex, 1, 0, 0, 0, -1)); i <= getWeek(new Date(year, monthIndex, monthEndDay, 0, 0, 0, -1)); i++) {
            weeks.push(i);
        }
    }
    
    return weeks.length;
}