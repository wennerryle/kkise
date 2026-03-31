import { SvelteMap } from 'svelte/reactivity';
import { Track } from './Track.svelte';
import { browser } from '$app/environment';

export class TrackRepository {
	tracks = new SvelteMap<string, Track>();

	tracksIds: string[] = $state([]);

	constructor() {
		if (browser) {
			// @ts-expect-error for debug reason
			window.tracksRepo = this;
		}

		this.add(new Track('track1id', 'Track 1', ['interval1', 'interval4']));

		this.add(new Track('track2id', 'Track 2', ['interval2']));

		this.add(new Track('track3id', 'Track 3', ['interval3']));
	}

	add(track: Track) {
		this.tracksIds.push(track.id);
		this.tracks.set(track.id, track);
	}

	get(id: string) {
		return this.tracks.get(id);
	}
}
