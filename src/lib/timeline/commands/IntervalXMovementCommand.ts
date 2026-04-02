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

	update(movementX: number) {
		this.#currentMovementX = movementX;
		this.#applyPosition();
	}

	#applyPosition() {
		const ctx = this.#timelineCtx;

		const movementMs = this.#currentMovementX / ctx.viewport.zoomLevelMs;
		this.#totalDeltaMs += movementMs;

		const adjacentIntervals = ctx.timelineLayoutService.getAdjacentIntervals(
			this.#trackId,
			this.#interval
		);

		const offsetLimits = ctx.timelineLayoutService.getMovementLimits(
			this.#interval,
			adjacentIntervals,
			ctx.player.totalDuration
		);

		this.#interval.offset = clamp(
			this.#initialOffset + this.#totalDeltaMs,
			offsetLimits.min,
			offsetLimits.max
		);
	}

	execute() {
		this.#applyPosition();
	}

	undo() {
		this.#interval.offset = this.#initialOffset;
	}
}
