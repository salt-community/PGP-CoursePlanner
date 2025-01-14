import { getWeek } from "date-fns";

export function weeksCalc(year: number, monthIndex: number, endDay: string): number[] {
    console.log(year, monthIndex, endDay)

    const weeks: number[] = [];
    if (getWeek(new Date(year, monthIndex, parseInt(endDay), 0, 0, 0, -1)) === 1) {
        for (let i = getWeek(new Date(year, monthIndex, 1, 0, 0, 0, -1)); i <= 52; i++) {
            weeks.push(i);
        }
        weeks.push(1)
    }
    else {
        for (let i = getWeek(new Date(year, monthIndex, 1, 0, 0, 0, -1)); i <= getWeek(new Date(year, monthIndex, parseInt(endDay), 0, 0, 0, -1)); i++) {
            weeks.push(i);
        }
    }

    return weeks;
}