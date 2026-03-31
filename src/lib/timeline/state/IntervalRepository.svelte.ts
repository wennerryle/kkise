import { browser } from "$app/environment";
import { SvelteMap } from "svelte/reactivity";
import { Interval } from "./Interval.svelte";

export class IntervalRepository {
    intervals = new SvelteMap<string, Interval>();

    constructor() {
        if (browser) {
            // @ts-expect-error for debug reason
            window.intervalRepo = this;
        }

        for (let i = 0; i < 4; i++) {
            const gapS = 1000;
            const size = 8 * 1000;

            this.addInterval(
                new Interval("interval" + (i + 1), (gapS + size) * i, size),
            );
        }
    }

    addInterval(interval: Interval) {
        this.intervals.set(interval.id, interval);
    }
}
