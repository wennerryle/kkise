import { clamp } from 'es-toolkit';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Undoable } from './ICommand';
import { MIN_INTERVAL_DURATION } from '../services/TimelineLayoutService';

export class IntervalRightResizeCommand implements Undoable {
	#timelineCtx: TimelineContext;
	#trackId: string;
	#initialOffset: number;
	#initialDuration: number;
	#intervalId: string;

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

	#appliedDuration = 0;

	#applyPosition() {
		const ctx = this.#timelineCtx;
		const movementMs = this.#currentMovementX / ctx.viewport.pixelsPerMs;
		this.#totalDeltaMs += movementMs;

		const [, right] = ctx.timelineLayoutService.getAdjacentIntervals(this.#trackId, this.#interval);

		const maxAvailable =
			(right !== null ? right.offset : ctx.player.totalDurationMs) - this.#initialOffset;

		this.#appliedDuration = clamp(
			this.#initialDuration + this.#totalDeltaMs,
			MIN_INTERVAL_DURATION,
			maxAvailable
		);

		this.#interval.duration = this.#appliedDuration;
	}

	undo(): void {
		this.#interval.offset = this.#initialOffset;
		this.#interval.duration = this.#initialDuration;
	}

	execute(): boolean {
		this.#interval.duration = this.#appliedDuration;
		return true;
	}
}
