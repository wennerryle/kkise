import type { Interval } from "../state/Interval.svelte";
import type { IntervalRepository } from "../state/IntervalRepository.svelte";
import type { Track } from "../state/Track.svelte";

export function detectIntervalsCollision(
    source: Interval,
    target: Interval,
) {
    const sourceEnd = source.duration + source.offset;
    const targetEnd = target.duration + target.offset;

    return sourceEnd > target.offset && source.offset < targetEnd;
}

export function detectIntervalToTracksMovingCollision(
    intervalRepo: IntervalRepository,
    targetTrack: Track,
    checkedInterval: Interval,
) {
    return targetTrack.intervals.some((targetIntervalId) => {
        const target = intervalRepo.intervals.get(targetIntervalId)!;

        return detectIntervalsCollision(
            checkedInterval,
            target,
        );
    });
}

export function binarySearchInterval(
    intervals: Interval[],
    target: Interval,
) {
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
    checkedInterval: Interval,
) {
    const intervals = getIntervalsFromTrack(intervalRepo, track)
        .sort(intervalsComparator);

    const result = binarySearchInterval(intervals, checkedInterval);

    return (result > 0 &&
        detectIntervalsCollision(intervals[result - 1], checkedInterval)) ||
        (result < intervals.length - 1 &&
            detectIntervalsCollision(intervals[result + 1], checkedInterval));
}

export function getIntervalsFromTrack(
    intervalRepo: IntervalRepository,
    track: Track,
) {
    return track.intervals.map((it) => intervalRepo.intervals.get(it)!);
}

export function intervalsComparator(interval1: Interval, interval2: Interval) {
    return interval1.offset - interval2.offset;
}

// export function getAdjacentIntervals(
//     interval: Interval,
//     track: Track,
//     repository: IntervalRepository,
// ): [Interval | null, Interval | null] {
//     const intervals = getIntervalsFromTrack(repository, track).sort(
//         intervalsComparator,
//     );

//     const currentIntervalPosition = binarySearchInterval(intervals, interval);

//     const len = intervals.length;

//     let left = null;
//     let right = null;

//     if (currentIntervalPosition > 0) {
//         left = intervals;
//     }

//     return [left, right];
// }
