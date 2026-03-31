export class Track {
    id: string;
    title: string;
    intervals: string[];

    constructor(id: string, title: string, intervals: string[]) {
        this.id = $state(id);
        this.title = $state(title);
        this.intervals = $state(intervals);
    }
}
