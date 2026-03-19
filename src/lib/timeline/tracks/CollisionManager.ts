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

export function detectIntervalMovementCollision(
    intervalRepo: IntervalRepository,
    track: Track,
    checkedInterval: Interval,
) {
    return track.intervals.some((targetIntervalId) => {
        const comparableInterval = intervalRepo.intervals.get(
            targetIntervalId,
        )!;

        if (checkedInterval.id === comparableInterval.id) return false;

        return detectIntervalsCollision(
            checkedInterval,
            comparableInterval,
        );
    });
}
