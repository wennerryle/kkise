import { clamp } from 'es-toolkit';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Interval } from '../state/Interval.svelte';
import type { Undoable } from './ICommand';

export class IntervalXMovementCommand implements Undoable {
	#timelineCtx: TimelineContext;
	#trackId: string;
	#interval: Interval;

	readonly #initialOffset: number;

	#totalDeltaMs = 0;
	#currentMovementX = 0;

	constructor(timelineCtx: TimelineContext, trackId: string, interval: Interval) {
		this.#timelineCtx = timelineCtx;
		this.#trackId = trackId;
		this.#interval = interval;
		this.#initialOffset = interval.offset;
	}

	private getMaxOffset() {
		return this.#timelineCtx.player.totalDuration - this.#interval.duration;
	}

	update(movementX: number) {
		this.#currentMovementX = movementX;
		this.#applyPosition();
	}

	#applyPosition() {
		const movementMs = this.#currentMovementX / this.#timelineCtx.viewport.zoomLevelMs;
		this.#totalDeltaMs += movementMs;

		const [left, right] = this.#timelineCtx.timelineLayoutService.getAdjacentIntervals(
			this.#trackId,
			this.#interval
		);

		const min = left !== null ? left.end : 0;
		const max = right !== null ? right.offset - this.#interval.duration : this.getMaxOffset();

		this.#interval.offset = clamp(this.#initialOffset + this.#totalDeltaMs, min, max);
	}

	execute() {
		this.#applyPosition();
	}

	undo() {
		this.#interval.offset = this.#initialOffset;
	}
}
