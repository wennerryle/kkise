import { clamp } from 'es-toolkit';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import type { Interval } from '../state/Interval.svelte';

export class IntervalXMovementCommand {
	#timelineCtx: TimelineContext;
	#trackId: string;
	#interval: Interval;

	readonly #initialOffset: number;
	#totalDeltaMs = 0;

	constructor(timelineCtx: TimelineContext, trackId: string, interval: Interval) {
		this.#timelineCtx = timelineCtx;
		this.#trackId = trackId;
		this.#interval = interval;
		this.#initialOffset = interval.offset;
	}

	private getMaxOffset() {
		return this.#timelineCtx.player.totalDuration - this.#interval.duration;
	}

	execute(movementX: number) {
		// Переводим пиксели в мс
		const movementMs = movementX / this.#timelineCtx.viewport.zoomLevelMs;
		this.#totalDeltaMs += movementMs;

		const [left, right] = this.#timelineCtx.timelineLayoutService.getAdjacentIntervals(
			this.#trackId,
			this.#interval
		);

		// Границы
		const min = left !== null ? left.end : 0;
		const max = right !== null ? right.offset - this.#interval.duration : this.getMaxOffset();

		// Применяем общее смещение к начальной позиции
		this.#interval.offset = clamp(this.#initialOffset + this.#totalDeltaMs, min, max);
	}

	undo() {
		this.#interval.offset = this.#initialOffset;
	}
}
