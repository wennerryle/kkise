import type { Attachment } from "svelte/attachments";
import type { Interval } from "../repos/Repositories.svelte";
import type { Viewport } from "../core/Viewport.svelte";

export class IntervalMoveController {
    ref: HTMLElement | null = null;
    interval: Interval;
    viewport: Viewport;

    constructor(interval: Interval, viewport: Viewport) {
        this.interval = interval;
        this.viewport = viewport;
    }

    attach: Attachment<HTMLElement> = (element) => {
        this.ref = element;

        element.addEventListener("pointerdown", this.onpointerdown);
        element.addEventListener("pointerup", this.onpointerup);

        return () => {
            element.removeEventListener("pointerdown", this.onpointerdown);
            element.removeEventListener("pointerup", this.onpointerup);
            element.removeEventListener("pointermove", this.onpointermove);
            this.ref = null;
        };
    };

    onpointerdown = (event: PointerEvent) => {
        if (event.target !== event.currentTarget) return;

        (event.target as HTMLElement).setPointerCapture(event.pointerId);
        this.ref!.addEventListener("pointermove", this.onpointermove);
    };

    onpointerup = (event: PointerEvent) => {
        if (event.target !== event.currentTarget) return;

        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
        this.ref!.removeEventListener("pointermove", this.onpointermove);
    };

    onpointermove = ({ movementX }: PointerEvent) => {
        const dpr = window.devicePixelRatio || 1;

        this.interval.offset = Math.max(
            0,
            this.interval.offset +
                (movementX / dpr) / this.viewport.zoomLevelMs,
        );

        console.log(movementX);
    };
}
