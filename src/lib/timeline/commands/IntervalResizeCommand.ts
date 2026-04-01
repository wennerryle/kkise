import type Interval from '../components/Interval.svelte';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Undoable } from './ICommand';

export class IntervalResizeCommand implements Undoable {
	#interval: Interval;
	#timelineCtx: TimelineContext;

	constructor(interval: Interval, timelineCtx: TimelineContext) {
		this.#interval = interval;
		this.#timelineCtx = timelineCtx;
	}

	undo(): void {
		throw new Error('Method not implemented.');
	}

	execute(): void {
		throw new Error('Method not implemented.');
	}
}
