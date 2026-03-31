import { IntervalRepository } from '../state/IntervalRepository.svelte';
import { Player } from '../state/Player.svelte';
import { TrackRepository } from '../state/TrackRepository.svelte';
import { Viewport } from '../state/Viewport.svelte';

export class TimelineContext {
	readonly player = new Player();
	readonly viewport = new Viewport();
	readonly trackRepository = new TrackRepository();
	readonly intervalRepository = new IntervalRepository();
}
