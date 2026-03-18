import { browser } from "$app/environment";
import { SvelteMap } from "svelte/reactivity";

export class Track {
    id: string;
    title: string;
    intervals: string[];

    constructor(id: string, title: string, intervals: string[]) {
        this.id = $state(id);
        this.title = $state(title);
        this.intervals = $state(intervals);
    }
}

export class TrackRepository {
    tracks = new SvelteMap<string, Track>();

    tracksIds: string[] = $state([]);

    constructor() {
        if (browser) {
            // @ts-expect-error for debug reason
            window.tracksRepo = this;
        }

        this.addTrack(
            new Track("track1id", "Track 1", [
                "interval1",
            ]),
        );

        this.addTrack(
            new Track("track2id", "Track 2", [
                "interval2",
            ]),
        );

        this.addTrack(
            new Track("track3id", "Track 3", [
                "interval3",
            ]),
        );
    }

    addTrack(track: Track) {
        this.tracksIds.push(track.id);
        this.tracks.set(track.id, track);
    }
}
export class Interval {
    /** Unique ID for interval */
    id: string;
    /** Offset in milliseconds (start of interval in track) */
    offset: number;
    /** Duration in milliseconds */
    duration: number;

    constructor(id: string, offset: number, duration: number) {
        this.id = $state(id);
        this.offset = $state(offset);
        this.duration = $state(duration);
    }
}

export class IntervalRepository {
    intervals = new SvelteMap<string, Interval>();

    constructor() {
        if (browser) {
            // @ts-expect-error for debug reason
            window.intervalRepo = this;
        }

        for (let i = 0; i < 3; i++) {
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
