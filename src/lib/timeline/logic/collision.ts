import type { IntervalLike } from '../state/Interval.svelte';
import type { IntervalRepository } from '../state/IntervalRepository.svelte';
import type { Track } from '../state/Track.svelte';

export function isIntervalsOverlap(a: IntervalLike, b: IntervalLike) {
	const sourceEnd = a.duration + a.offset;
	const targetEnd = b.duration + b.offset;

	return sourceEnd > b.offset && a.offset < targetEnd;
}

export function detectIntervalToTracksMovingCollision(
	intervalRepo: IntervalRepository,
	targetTrack: Track,
	checkedInterval: IntervalLike
) {
	return targetTrack.intervals.some((targetIntervalId) => {
		const target = intervalRepo.intervals.get(targetIntervalId)!;

		return isIntervalsOverlap(checkedInterval, target);
	});
}

export function binarySearchInterval(intervals: IntervalLike[], target: IntervalLike) {
	let low = 0;
	let high = intervals.length - 1;

	while (low <= high) {
		const mid = Math.floor((low + high) / 2);

		if (intervals[mid].id === target.id) {
			return mid;
		} else if (intervals[mid].offset < target.offset) {
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}

	return -1;
}

export function detectIntervalMovementCollision(
	intervalRepo: IntervalRepository,
	track: Track,
	checkedInterval: IntervalLike
) {
	const intervals = getIntervalsFromTrack(intervalRepo, track).sort(intervalsComparator);

	const result = binarySearchInterval(intervals, checkedInterval);

	return findCollisionInSortedList(intervals, result, checkedInterval);
}

export function findCollisionInSortedList(
	sorted: IntervalLike[],
	checkedIndex: number,
	checked: IntervalLike
): boolean {
	if (checkedIndex > 0 && isIntervalsOverlap(sorted[checkedIndex - 1], checked)) {
		return true;
	}

	if (checkedIndex < sorted.length - 1 && isIntervalsOverlap(sorted[checkedIndex + 1], checked)) {
		return true;
	}

	return false;
}

export function getIntervalsFromTrack(intervalRepo: IntervalRepository, track: Track) {
	return track.intervals.map((it) => intervalRepo.intervals.get(it)!);
}

export function intervalsComparator(a: IntervalLike, b: IntervalLike) {
	return a.offset - b.offset;
}
