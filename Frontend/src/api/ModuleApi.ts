import { Module } from "../components/module/Types";

const BASE_URL = "http://localhost:5268/Modules";

export async function getAllModules () {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data as Module[];
}