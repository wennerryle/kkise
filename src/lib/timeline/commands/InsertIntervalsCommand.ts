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

	execute(): boolean {
		const [error, ids] = this.#ctx.insertIntervalService.insertMany(
			this.#options,
			this.#insertedIntervals
		);

		if (error) {
			toast.error(error.message);
			return false;
		}

		toast.success('Successfully inserted!');

		this.#insertedIntervals = ids;
		return true;
	}

	undo(): void {
		const trackId = this.#options.trackId;
		const track = this.#ctx.trackRepository.get(trackId)!;
		const previous = track.intervals.filter((it) => !this.#insertedIntervals.includes(it));

		for (let i = 0; i < this.#insertedIntervals.length; i++) {
			this.#ctx.intervalRepository.intervals.delete(this.#insertedIntervals[i]);
		}

		track.intervals = previous;
	}
}
