import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Undoable } from './ICommand';
import { clamp } from 'es-toolkit';
import { MIN_INTERVAL_DURATION } from '../services/TimelineLayoutService';

export class IntervalLeftResizeCommand implements Undoable {
	#timelineCtx: TimelineContext;
	#trackId: string;
	#intervalId: string;
	#initialOffset: number;
	#initialDuration: number;

	constructor(intervalId: string, trackId: string, timelineCtx: TimelineContext) {
		this.#timelineCtx = timelineCtx;
		this.#trackId = trackId;

		this.#intervalId = intervalId;

		this.#initialDuration = this.#interval.duration;
		this.#initialOffset = this.#interval.offset;
	}

	get #interval() {
		return this.#timelineCtx.intervalRepository.get(this.#intervalId)!;
	}

	#currentMovementX = 0;
	#totalDeltaMs = 0;

	update(movementX: number) {
		this.#currentMovementX = movementX;
		this.#applyPosition();
	}

	#appliedOffset = 0;
	#appliedDuration = 0;

	#applyPosition() {
		const ctx = this.#timelineCtx;

		const movementMs = this.#currentMovementX / ctx.viewport.pixelsPerMs;
		this.#totalDeltaMs += movementMs;

		const adjacentIntervals = ctx.timelineLayoutService.getAdjacentIntervals(
			this.#trackId,
			this.#interval
		);

		const offsetLimits = ctx.timelineLayoutService.getMovementLimits(
			this.#interval,
			adjacentIntervals,
			ctx.player.totalDurationMs
		);

		const initialRightEdge = this.#initialOffset + this.#initialDuration;

		const maxAllowedOffset = initialRightEdge - MIN_INTERVAL_DURATION;

		const targetOffset = this.#initialOffset + this.#totalDeltaMs;

		const clampedOffset = clamp(targetOffset, offsetLimits.min, maxAllowedOffset);

		this.#appliedOffset = clampedOffset;
		this.#appliedDuration = initialRightEdge - clampedOffset;

		this.#interval.offset = this.#appliedOffset;
		this.#interval.duration = this.#appliedDuration;
	}

	undo(): void {
		this.#interval.offset = this.#initialOffset;
		this.#interval.duration = this.#initialDuration;
	}

	execute(): boolean {
		this.#interval.duration = this.#appliedDuration;
		this.#interval.offset = this.#appliedOffset;
		return true;
	}
}
