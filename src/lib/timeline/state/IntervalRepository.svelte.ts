import { browser } from '$app/environment';
import { SvelteMap } from 'svelte/reactivity';
import { Interval } from './Interval.svelte';

export class IntervalRepository {
	intervals = new SvelteMap<string, Interval>();

	constructor() {
		if (browser) {
			// @ts-expect-error for debug reason
			window.intervalRepo = this;
		}
	}

	add(interval: Interval) {
		this.intervals.set(interval.id, interval);
	}

	get(id: string): Interval | undefined {
		return this.intervals.get(id);
	}
}
