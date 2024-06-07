import { Module } from "../module/Types";

export type Course = {
    name: string;
    numberOfWeeks: number;
    modules: Module[];
}