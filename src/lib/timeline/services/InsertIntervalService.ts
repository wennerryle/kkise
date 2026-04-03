import { stringId } from '$lib/core/id';
import { TimelineContext } from '../context/TimelineContext.svelte';
import { detectIntervalToTracksMovingCollision } from '../logic/collision';
import { Interval } from '../state/Interval.svelte';

export interface InsertManyOptions {
	trackId: string;
	offset: number;
	duration: number;
	gap: number;
	amount: number;
}

export type InsertIntervalsResult = [Error, null] | [null, ids: string[]];

export class InsertIntervalService {
	#ctx: TimelineContext;

	constructor(ctx: TimelineContext) {
		this.#ctx = ctx;
	}

	insertMany({ amount, duration, gap, offset, trackId }: InsertManyOptions): InsertIntervalsResult {
		const track = this.#ctx.trackRepository.get(trackId)!;

		if (
			detectIntervalToTracksMovingCollision(this.#ctx.intervalRepository, track, {
				id: stringId(),
				duration,
				offset
			})
		) {
			return [new Error('Interval overlap error'), null];
		}

		const intervalDuration = (duration - (gap * amount - 1)) / amount;

		const intervals: Interval[] = Array.from({ length: amount });

		for (let i = 0; i < amount; i++) {
			intervals[i] = new Interval(stringId(), (intervalDuration + gap) * i, intervalDuration);
		}

		console.log(intervals);

		const ids = intervals.map((it) => it.id);

		intervals.forEach((it) => this.#ctx.intervalRepository.add(it));
		track.intervals.push(...ids);

		return [null, ids];
	}
}
