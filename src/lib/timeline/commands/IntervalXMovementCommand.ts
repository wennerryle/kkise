import { clamp } from 'es-toolkit';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Undoable } from './ICommand';

export class IntervalXMovementCommand implements Undoable {
	#timelineCtx: TimelineContext;
	#trackId: string;

	readonly #initialOffset: number;

	#totalDeltaMs = 0;
	#intervalId: string;

	constructor(timelineCtx: TimelineContext, trackId: string, intervalId: string) {
		this.#timelineCtx = timelineCtx;
		this.#trackId = trackId;
		this.#intervalId = intervalId;
		this.#initialOffset = this.#interval.offset;
	}

	get #interval() {
		return this.#timelineCtx.intervalRepository.get(this.#intervalId)!;
	}

	#currentMovementX = 0;

	update(movementX: number) {
		this.#currentMovementX = movementX;
		this.#applyPosition();
	}

	#appliedOffset = 0;

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

		this.#appliedOffset = clamp(
			this.#initialOffset + this.#totalDeltaMs,
			offsetLimits.min,
			offsetLimits.max
		);

		this.#interval.offset = this.#appliedOffset;
	}

	execute(): boolean {
		this.#interval.offset = this.#appliedOffset;
		return true;
	}

	undo() {
		this.#interval.offset = this.#initialOffset;
	}
}
