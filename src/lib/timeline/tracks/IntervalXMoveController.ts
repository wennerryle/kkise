import type { Attachment } from "svelte/attachments";
import {
    Interval,
    type IntervalRepository,
    type Track,
} from "../repos/Repositories.svelte";
import type { Viewport } from "../core/Viewport.svelte";
import { clamp } from "es-toolkit";
import { detectIntervalMovementCollision } from "./CollisionManager";

interface IntervalXMoveControllerOptions {
    intervalRepo: IntervalRepository;
    interval: Interval;
    viewport: Viewport;
    track: Track;
}

export class IntervalXMoveController {
    ref: HTMLElement | null = null;
    options: IntervalXMoveControllerOptions;

    dragging = false;

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

        this.dragging = true;

        (event.target as HTMLElement).setPointerCapture(event.pointerId);
        this.ref!.addEventListener("pointermove", this.onpointermove);
    };

    onpointerup = (event: PointerEvent) => {
        if (event.target !== event.currentTarget) return;

        this.dragging = false;

        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
        this.ref!.removeEventListener("pointermove", this.onpointermove);
    };

    onpointermove = ({ movementX }: PointerEvent) => {
        const dpr = window.devicePixelRatio || 1;

        const movement = clamp(
            this.options.interval.offset +
                (movementX / dpr) / this.options.viewport.zoomLevelMs,
            0,
            this.options.viewport.totalDuration -
                this.options.interval.duration,
        );

        if (movement === this.options.interval.offset) return;

        const proxyInterval = new Interval(
            this.options.interval.id,
            movement,
            this.options.interval.duration,
        );

        const isCollision = detectIntervalMovementCollision(
            this.options.intervalRepo,
            this.options.track,
            proxyInterval,
        );

        if (isCollision) return;

        this.options.interval.offset = movement;
    };
}
