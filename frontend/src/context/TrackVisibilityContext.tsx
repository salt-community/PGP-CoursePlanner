import { TrackVisibility } from '@helpers/localStorage';
import { createContext } from 'react';

export const TrackVisibilityContext = createContext<{ trackVisibility: TrackVisibility[], setTrackVisibility: React.Dispatch<React.SetStateAction<TrackVisibility[]>>}>({ trackVisibility: [], setTrackVisibility: () => { } });