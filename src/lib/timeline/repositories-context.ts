import {
    type IntervalRepository,
    TrackRepository,
} from "./repos/Repositories.svelte";
import { createContext } from "svelte";

export const [getIntervalRepository, setIntervalRepository] = createContext<
    IntervalRepository
>();

export const [getTrackRepository, setTrackRepository] = createContext<
    TrackRepository
>();
