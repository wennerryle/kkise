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
    tracksIds = $state<string[]>([]);

    constructor() {
        this.addTrack(
            new Track("track1", "Track 1", [
                "interval1",
                "interval2",
                "interval3",
            ]),
        );

        this.addTrack(
            new Track("track2", "Track 2", [
                "interval1",
                "interval2",
                "interval3",
            ]),
        );

        this.addTrack(
            new Track("track3", "Track 3", [
                "interval1",
                "interval2",
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
    /** Unique ID for inteval */
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
            // @ts-expect-error
            window.intervalRepo = this;
        }

        for (let i = 0; i < 3; i++) {
            this.addInterval(
                new Interval("interval" + (i + 1), 16000 * i, 15000),
            );
        }
    }

    addInterval(interval: Interval) {
        this.intervals.set(interval.id, interval);
    }
}
