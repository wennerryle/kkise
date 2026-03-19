import { Viewport } from "../core/Viewport.svelte";
import type { Interval } from "../repos/Repositories.svelte";
import type { Attachment } from "svelte/attachments";

interface IntervalResizeControllerOptions {
    interval: Interval;
    viewport: Viewport;
}

export class IntervalResizeController {
    options: IntervalResizeControllerOptions;

    constructor(options: IntervalResizeControllerOptions) {
        this.options = options;
    }

    leftControllerAttachment: Attachment<HTMLElement> = (element) => {
        element.addEventListener("pointerdown", this.onLeftPointerDown);
        element.addEventListener("pointerup", this.onLeftPointerUp);

        return () => {
            element.removeEventListener("pointerdown", this.onLeftPointerDown);
            element.removeEventListener("pointerup", this.onLeftPointerUp);
            element.removeEventListener("pointermove", this.onLeftPointerMove);
        };
    };

    onLeftPointerDown = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        target.setPointerCapture(event.pointerId);
        target.addEventListener("pointermove", this.onLeftPointerMove);
    };

    onLeftPointerUp = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        target.releasePointerCapture(event.pointerId);
        target.removeEventListener("pointermove", this.onLeftPointerMove);
    };

    onLeftPointerMove = ({ movementX }: PointerEvent) => {
        const dpr = window.devicePixelRatio || 1;
        const taken = movementX / dpr / this.options.viewport.zoomLevelMs;

        const offset = this.options.interval.offset;

        const duration = this.options.interval.duration;
        this.options.interval.duration = Math.max(200, duration + taken * -1);

        if (duration !== 200) {
            this.options.interval.offset = Math.max(0, offset + taken);
        }
    };

    rightControllerAttachment: Attachment<HTMLElement> = (element) => {
        element.addEventListener("pointerdown", this.onRightPointerDown);
        element.addEventListener("pointerup", this.onRightPointerUp);

        return () => {
            element.removeEventListener("pointerdown", this.onRightPointerDown);
            element.removeEventListener("pointerup", this.onRightPointerUp);
            element.removeEventListener("pointermove", this.onRightPointerMove);
        };
    };

    onRightPointerDown = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        target.setPointerCapture(event.pointerId);
        target.addEventListener("pointermove", this.onRightPointerMove);
    };

    onRightPointerUp = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        target.releasePointerCapture(event.pointerId);
        target.removeEventListener("pointermove", this.onRightPointerMove);
    };

    onRightPointerMove = ({ movementX }: PointerEvent) => {
        const dpr = window.devicePixelRatio || 1;
        const taken = movementX / dpr / this.options.viewport.zoomLevelMs;

        const duration = this.options.interval.duration;

        this.options.interval.duration = Math.max(200, duration + taken);
    };
}
