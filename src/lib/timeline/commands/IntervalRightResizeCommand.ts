import { clamp } from 'es-toolkit';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Interval } from '../state/Interval.svelte';
import type { Undoable } from './ICommand';
import { MIN_INTERVAL_DURATION } from '../services/TimelineLayoutService';

export class IntervalRightResizeCommand implements Undoable {
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
		const movementMs = this.#currentMovementX / ctx.viewport.pixelsPerMs;
		this.#totalDeltaMs += movementMs;

		const [, right] = ctx.timelineLayoutService.getAdjacentIntervals(this.#trackId, this.#interval);

		const maxAvailable =
			(right !== null ? right.offset : ctx.player.totalDurationMs) - this.#initialOffset;

		this.#interval.duration = clamp(
			this.#initialDuration + this.#totalDeltaMs,
			MIN_INTERVAL_DURATION,
			maxAvailable
		);
	}

	undo(): void {
		this.#interval.offset = this.#initialOffset;
		this.#interval.duration = this.#initialDuration;
	}

	execute(): boolean {
		this.#applyPosition();
		return true;
	}
}
