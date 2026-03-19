import type {
    Interval,
    IntervalRepository,
    Track,
} from "../repos/Repositories.svelte";

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
    intervalId: string,
) {
    const source = intervalRepo.intervals.get(intervalId)!;

    return targetTrack.intervals.some((targetIntervalId) => {
        const target = intervalRepo.intervals.get(targetIntervalId)!;

        return detectIntervalsCollision(
            source,
            target,
        );
    });
}
