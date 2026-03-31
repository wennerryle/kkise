export class Interval {
    /** Unique ID for interval */
    id: string;
    /** Offset in milliseconds (start of interval in track) */
    offset: number;
    /** Duration in milliseconds */
    duration: number;

    constructor(id: string, offset: number, duration: number) {
        this.id = $state(id);
        this.offset = $state(offset);
        this.duration = $state(duration);
    }

    debug() {
        console.log({
            id: this.id,
            offset: this.offset,
            duration: this.duration,
        });
    }
}
