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
export type InsertIntervalResult = [Error, null] | [null, id: string];

export class InsertIntervalService {
	#ctx: TimelineContext;

	constructor(ctx: TimelineContext) {
		this.#ctx = ctx;
	}

	insertMany(
		{ amount, duration, gap, offset, trackId }: InsertManyOptions,
		withIds: string[] = []
	): InsertIntervalsResult {
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

		const totalGapsDuration = gap * (amount - 1);
		const intervalDuration = (duration - totalGapsDuration) / amount;

		if (intervalDuration <= 0) {
			return [new Error('Gap is too large or duration too small'), null];
		}

		const intervals: Interval[] = [];

		for (let i = 0; i < amount; i++) {
			const currentOffset = offset + (intervalDuration + gap) * i;
			intervals.push(new Interval(stringId(), currentOffset, intervalDuration));
		}

		for (let i = 0; i < withIds.length; i++) {
			intervals[i].id = withIds[i];
		}

		const ids = intervals.map((it) => it.id);

		intervals.forEach((it) => this.#ctx.intervalRepository.add(it));
		track.intervals.push(...ids);

		return [null, ids];
	}

	insert(trackId: string, interval: Interval): InsertIntervalResult {
		const track = this.#ctx.trackRepository.get(trackId)!;

		if (detectIntervalToTracksMovingCollision(this.#ctx.intervalRepository, track, interval)) {
			return [new Error('Interval overlap error'), null];
		}

		this.#ctx.intervalRepository.add(interval);
		track.intervals.push(interval.id);

		return [null, interval.id];
	}
}

interface CalculateIntervalDurationArguments {
	totalDuration: number;
	intervalsAmount: number;
	gapDuration: number;
}

interface CalculateMaxIntervalAmountArguments {
	totalDuration: number;
	gapDuration: number;
	minIntervalDuration: number;
}

type ConstraintSolveResult = [null, number] | [Error, null];

export function calculateIntervalDuration({
	gapDuration,
	intervalsAmount,
	totalDuration
}: CalculateIntervalDurationArguments): ConstraintSolveResult {
	if (Math.min(intervalsAmount, totalDuration) <= 0) {
		return [new Error('IntervalAmount and TotalDuration must be positive.'), null];
	}

	return [null, (totalDuration - gapDuration * (intervalsAmount - 1)) / intervalsAmount];
}

export function calculateMaxIntervalsAmount({
	gapDuration,
	totalDuration,
	minIntervalDuration
}: CalculateMaxIntervalAmountArguments) {
	return Math.floor((totalDuration + gapDuration) / (minIntervalDuration + gapDuration));
}
