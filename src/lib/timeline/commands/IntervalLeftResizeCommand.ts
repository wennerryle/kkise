import type { Interval } from '../state/Interval.svelte';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Undoable } from './ICommand';
import { clamp } from 'es-toolkit';
import { MIN_INTERVAL_DURATION } from '../services/TimelineLayoutService';

export class IntervalLeftResizeCommand implements Undoable {
	#interval: Interval;
	#timelineCtx: TimelineContext;
	#trackId: string;
	#initialOffset: number;
	#initialDuration: number;

	constructor(interval: Interval, trackId: string, timelineCtx: TimelineContext) {
		this.#interval = interval;
		this.#timelineCtx = timelineCtx;
		this.#trackId = trackId;
		this.#initialDuration = interval.duration;
		this.#initialOffset = interval.offset;
	}

	#currentMovementX = 0;
	#totalDeltaMs = 0;

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

		let maxOffset = offsetLimits.max;

		if (this.#interval.duration === MIN_INTERVAL_DURATION) {
			maxOffset = this.#interval.offset;
		}

		const durationDiff = this.#initialDuration - this.#totalDeltaMs;

		if (this.#interval.offset === offsetLimits.min) {
			this.#interval.duration = clamp(durationDiff, MIN_INTERVAL_DURATION, this.#interval.duration);
		} else {
			this.#interval.duration = Math.max(durationDiff, MIN_INTERVAL_DURATION);
		}

		this.#interval.offset = clamp(
			this.#initialOffset + this.#totalDeltaMs,
			offsetLimits.min,
			maxOffset
		);
	}

	undo(): void {
		this.#interval.offset = this.#initialOffset;
		this.#interval.duration = this.#initialDuration;
	}

	execute(): void {
		this.#applyPosition();
	}
}
