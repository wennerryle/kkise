import { binarySearchInterval, intervalsComparator } from '../logic/collision';
import type { IntervalLike } from '../state/Interval.svelte';
import type { IntervalRepository } from '../state/IntervalRepository.svelte';
import type { TrackRepository } from '../state/TrackRepository.svelte';

type MaybeInterval = IntervalLike | null;

export const MIN_INTERVAL_DURATION = 200;

export class TimelineLayoutService {
	#trackRepository: TrackRepository;
	#intervalRepository: IntervalRepository;

	constructor(trackRepository: TrackRepository, intervalRepository: IntervalRepository) {
		this.#trackRepository = trackRepository;
		this.#intervalRepository = intervalRepository;
	}

	getAdjacentIntervals(trackId: string, interval: IntervalLike): [MaybeInterval, MaybeInterval] {
		const intervals = this.#trackRepository
			.get(trackId)!
			.intervals.map((id) => this.#intervalRepository.get(id)!)
			.sort(intervalsComparator);

		const index = binarySearchInterval(intervals, interval);

		let left: MaybeInterval = null;
		let right: MaybeInterval = null;

		if (index > 0) {
			left = intervals[index - 1];
		}

		if (index < intervals.length - 1 && index !== -1) {
			right = intervals[index + 1];
		}

		return [left, right];
	}

	getMovementLimits(
		interval: IntervalLike,
		adjacentIntervals: [MaybeInterval, MaybeInterval],
		playerTotalDuration: number
	) {
		const [left, right] = adjacentIntervals;

		const min = left !== null ? left.offset + left.duration : 0;
		const max =
			right !== null ? right.offset - interval.duration : playerTotalDuration - interval.duration;

		return { min, max };
	}
}
