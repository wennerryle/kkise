export interface IntervalLike {
    id: string;
    offset: number;
    duration: number;
}

export class Interval implements IntervalLike {
    id: string;
    /** ms */
    offset: number;
    /** ms */
    duration: number;

    constructor(id: string, offset: number, duration: number) {
        this.id = $state(id);
        this.offset = $state(offset);
        this.duration = $state(duration);
    }

    get end() {
        return this.offset + this.duration;
    }

    debug() {
        console.log({
            id: this.id,
            offset: this.offset,
            duration: this.duration,
        });
    }
}
