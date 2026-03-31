import { createContext } from 'svelte';
import type { TimelineContext } from './TimelineContext.svelte';

export const [getTimelineContext, setTimelineContext] = createContext<TimelineContext>();
