import type { IntervalRepository } from "../repos/Repositories.svelte";

export class CollisionManager {
    intervalRepo: IntervalRepository;
    constructor(intervalRepo: IntervalRepository) {
        this.intervalRepo = intervalRepo;
    }

    detectIntervalsCollision(
        sourceIntervalId: string,
        targetIntervalId: string,
    ) {
        if (sourceIntervalId === targetIntervalId) return true;

        const source = this.intervalRepo.intervals.get(sourceIntervalId)!;
        const target = this.intervalRepo.intervals.get(targetIntervalId)!;

        const sourceEnd = source.duration + source.offset;
        const targetEnd = target.duration + target.offset;

        return sourceEnd > target.offset && source.offset < targetEnd;
    }
}
