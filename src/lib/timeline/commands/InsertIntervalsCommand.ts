import { toast } from 'svelte-sonner';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import { type InsertManyOptions } from '../services/InsertIntervalService';
import { type Undoable } from './ICommand';

export class InsertIntervalCommand implements Undoable {
	#ctx: TimelineContext;
	#options: InsertManyOptions;

	constructor(ctx: TimelineContext, options: InsertManyOptions) {
		this.#ctx = ctx;
		this.#options = options;
	}

	#insertedIntervals: string[] = [];

	undo(): void {
		const trackId = this.#options.trackId;
		const track = this.#ctx.trackRepository.get(trackId)!;
		const previous = track.intervals.filter((it) => !this.#insertedIntervals.includes(it));

		track.intervals = previous;
	}

	execute(): void {
		const [error, ids] = this.#ctx.insertIntervalService.insertMany(this.#options);

		if (error) {
			toast.error(error.message);
			return;
		}

		this.#insertedIntervals = ids;
	}
}
