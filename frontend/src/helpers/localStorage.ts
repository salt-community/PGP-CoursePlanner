import { Track } from "@models/course/Types";

export interface TrackVisibility {
    id: number;
    name: string,
    color: string,
    visibility: boolean;
}

export function getStorageTrackVisibility(): TrackVisibility[] {
    const trackVisibilityStr = localStorage.getItem('visibleTracks');
    if (trackVisibilityStr) {
        const trackVisibility: TrackVisibility[] = JSON.parse(trackVisibilityStr);
        return trackVisibility;
    }
    return [];
}

export function initialStorageTrackVisibility(tracks: Track[]): void {
    const trackVisibilityStr = localStorage.getItem('visibleTracks');
    let trackVisibility: TrackVisibility[] = [];
    if (trackVisibilityStr) {
        trackVisibility = JSON.parse(trackVisibilityStr);
    }

    const newTrackVisibility = tracks.map(track => {
        const visibility = trackVisibility.find(t => t && t.id == track.id)?.visibility
        if (track.id) {
            return {
                id: track.id,
                name: track.name,
                color: track.color,
                visibility: visibility === undefined ? true : visibility
            }
        }
    });

    localStorage.setItem('visibleTracks', JSON.stringify(newTrackVisibility));
}

export function updateStorageTrackVisibility(id: number, visibility: boolean): void {
    const trackVisibility = getStorageTrackVisibility();
    const newTrackVisibility: TrackVisibility[] = trackVisibility.map(t => {
        return {
            id: t.id,
            name: t.name,
            color: t.color,
            visibility: t.id === id ? visibility : t.visibility
        }
    });

    localStorage.setItem('visibleTracks', JSON.stringify(newTrackVisibility));
}