import { clamp } from 'es-toolkit';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Interval } from '../state/Interval.svelte';

export class IntervalXMovementCommand {
	#timelineCtx: TimelineContext;
	#trackId: string;
	#interval: Interval;

	constructor(timelineCtx: TimelineContext, trackId: string, interval: Interval) {
		this.#timelineCtx = timelineCtx;
		this.#trackId = trackId;
		this.#interval = interval;
	}

	relativeMovement = 0;

	getMaxOffset() {
		return this.#timelineCtx.player.totalDuration - this.#interval.duration;
	}

	execute(movementX: number) {
		const movementMs = movementX / this.#timelineCtx.viewport.zoomLevelMs;

		this.relativeMovement += movementMs;

		const [left, right] = this.#timelineCtx.timelineLayoutService.getAdjacentIntervals(
			this.#trackId,
			this.#interval
		);

		const min = left !== null ? left.end : 0;

		right?.debug();

		const max = right !== null ? right.offset - this.#interval.duration : this.getMaxOffset();

		const offset = clamp(this.#interval.offset + movementMs, min, max);

		console.log({
			min,
			max,
			offset,
			originalOffset: this.#interval.offset,
			movement: this.relativeMovement
		});

		this.#interval.offset = offset;
	}

	undo() {
		this.#interval.offset -= this.relativeMovement;
	}
}
