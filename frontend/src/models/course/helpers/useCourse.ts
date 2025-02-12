import { useState, useEffect } from "react";
import { ModuleType } from "@models/course/Types";
import { useQueryModules } from "@api/module/moduleQueries";
import { useQueryModulesByCourseId } from "@api/course/courseQueries";
import { Track } from "../Types";

export function useCourse(courseId: number) {
    const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [courseModules, setCourseModules] = useState<ModuleType[]>([]);
    const { data: modules } = useQueryModules();
    const { data: courseModulesData } = useQueryModulesByCourseId(courseId);

    useEffect(() => {
        if (modules) {
            setFilteredModules(modules);
            const uniqueTracks = Array.from(new Set(modules.flatMap(m => m.tracks || [])));
            setTracks(uniqueTracks);
        }
    }, [modules]);

    useEffect(() => {
        if (courseModulesData) {
            setCourseModules(courseModulesData);
        } else {
            setCourseModules([{
                id: 0, name: "", numberOfDays: 0, days: [],
                tracks: []
            }]);
        }
    }, [courseModulesData]);

    return {
        modules,
        tracks,
        filteredModules,
        setFilteredModules,
        courseModules,
        setCourseModules,
    };
}