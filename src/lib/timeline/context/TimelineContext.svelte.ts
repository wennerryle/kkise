import type { Interval } from '../state/Interval.svelte';
import { IntervalRepository } from '../state/IntervalRepository.svelte';
import type { Track } from '../state/Track.svelte';
import { TrackRepository } from '../state/TrackRepository.svelte';
import { Viewport } from '../state/Viewport.svelte';

export class TimelineContext {
	readonly viewport = new Viewport();
	readonly trackRepository = new TrackRepository();
	readonly intervalRepository = new IntervalRepository();

	getTrack(trackId: string): Track {
		return this.trackRepository.get(trackId)!;
	}

	getInterval(intervalId: string): Interval {
		return this.intervalRepository.get(intervalId)!;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	moveIntervalX(_intervalId: string, _trackId: string, _deltaMs: number): boolean {
		throw 'not implemented';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	resizeIntervalLeft(_intervalId: string, _deltaMs: number): boolean {
		throw 'not implemented';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	resizeIntervalRight(_intervalId: string, _deltaMs: number): boolean {
		throw 'not implemented';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	moveIntervalToTrack(_intervalId: string, _from: string, _to: string): boolean {
		throw 'not implemented';
	}
}
