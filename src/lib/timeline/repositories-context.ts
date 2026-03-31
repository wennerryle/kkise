import type { IntervalRepository } from "./state/IntervalRepository.svelte";
import type { TrackRepository } from "./state/TrackRepository.svelte";

import { createContext } from "svelte";

export const [getIntervalRepository, setIntervalRepository] = createContext<
    IntervalRepository
>();

export const [getTrackRepository, setTrackRepository] = createContext<
    TrackRepository
>();
