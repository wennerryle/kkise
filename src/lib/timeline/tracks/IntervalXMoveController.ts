import type { Attachment } from "svelte/attachments";
import type { Interval } from "../repos/Repositories.svelte";
import type { Viewport } from "../core/Viewport.svelte";
import { clamp } from "es-toolkit";

interface IntervalXMoveControllerOptions {
    interval: Interval;
    viewport: Viewport;
    trackId: string;
}

export class IntervalXMoveController {
    ref: HTMLElement | null = null;
    options: IntervalXMoveControllerOptions;

    constructor(options: IntervalXMoveControllerOptions) {
        this.options = options;
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

        const movement = this.options.interval.offset +
            (movementX / dpr) / this.options.viewport.zoomLevelMs;

        this.options.interval.offset = clamp(
            movement,
            0,
            this.options.viewport.totalDuration -
                this.options.interval.duration,
        );
    };
}
