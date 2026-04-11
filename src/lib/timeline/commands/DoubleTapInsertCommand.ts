import { stringId } from '$lib/core/id';
import { toast } from 'svelte-sonner';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import { MIN_INTERVAL_DURATION } from '../services/TimelineLayoutService';
import { Interval } from '../state/Interval.svelte';
import type { Undoable } from './ICommand';

interface DoubleTapInsertCommandOptions {
	timeMs: number;
	trackId: string;
}

export class DoubleTapInsertCommand implements Undoable {
	#ctx: TimelineContext;
	#options: DoubleTapInsertCommandOptions;

	constructor(context: TimelineContext, options: DoubleTapInsertCommandOptions) {
		this.#ctx = context;
		this.#options = options;
	}

	#id = '';

	execute(): boolean {
		if (this.#id === '') {
			this.#id = stringId();
		}

		const interval = new Interval(
			this.#id,
			this.#options.timeMs - MIN_INTERVAL_DURATION / 2,
			MIN_INTERVAL_DURATION
		);

		const [error, result] = this.#ctx.insertIntervalService.insert(this.#options.trackId, interval);

		if (error !== null) {
			toast.error('Overlap error. Cannot insert interval in that place.');
			return false;
		}

		this.#id = result;

		return true;
	}

	undo(): void {
		const track = this.#ctx.trackRepository.get(this.#options.trackId)!;

		track.intervals = track.intervals.filter((it) => it !== this.#id);

		this.#ctx.intervalRepository.intervals.delete(this.#options.trackId);
	}
}
