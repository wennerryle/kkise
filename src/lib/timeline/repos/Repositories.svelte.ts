import { SvelteMap } from "svelte/reactivity";

export interface Track {
    id: string;
    title: string;
    intervals: string[];
}

export class TrackRepository {
    tracks = new SvelteMap<string, Track>();
    tracksIds = $state<string[]>([]);

    constructor() {
        this.addTrack({
            id: "track1",
            title: "Track 1",
            intervals: ["interval1", "interval2", "interval3"],
        });

        this.addTrack({
            id: "track2",
            title: "Track 2",
            intervals: [],
        });

        this.addTrack({
            id: "track3",
            title: "Track 3",
            intervals: [],
        });
    }

    addTrack(track: Track) {
        this.tracksIds.push(track.id);
        this.tracks.set(track.id, track);
    }
}

export interface Interval {
    /** Unique ID for inteval */
    id: string;
    /** Offset in milliseconds (start of interval in track) */
    offset: number;
    /** Duration in milliseconds */
    duration: number;
}

export class IntervalRepository {
    intervals = new SvelteMap<string, Interval>();

    constructor() {
        this.intervals.set("interval1", {
            id: "interval1",
            duration: 15 * 1000,
            offset: 1000,
        });

        this.intervals.set("interval2", {
            id: "interval2",
            duration: 15 * 1000,
            offset: 17 * 1000,
        });

        this.intervals.set("interval3", {
            id: "interval3",
            duration: 15 * 1000,
            offset: 33 * 1000,
        });
    }
}
