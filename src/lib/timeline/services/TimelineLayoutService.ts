import { binarySearchInterval, intervalsComparator } from '../logic/collision';
import type { Interval } from '../state/Interval.svelte';
import type { IntervalRepository } from '../state/IntervalRepository.svelte';
import type { TrackRepository } from '../state/TrackRepository.svelte';

type MaybeInterval = Interval | null;

export class TimelineLayoutService {
	#trackRepository: TrackRepository;
	#intervalRepository: IntervalRepository;

	constructor(trackRepository: TrackRepository, intervalRepository: IntervalRepository) {
		this.#trackRepository = trackRepository;
		this.#intervalRepository = intervalRepository;
	}

	getAdjacentIntervals(trackId: string, interval: Interval): [MaybeInterval, MaybeInterval] {
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

		if (index < intervals.length - 1) {
			right = intervals[index + 1];
		}

		return [left, right];
	}
}
