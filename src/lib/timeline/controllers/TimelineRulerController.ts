import type { Viewport } from "../state/Viewport.svelte.ts";
import { MouseButtons } from "../logic/constants.ts";
import type { HTMLAttributes } from "svelte/elements";

export class TimelineRulerController {
    viewport: Viewport;

    isMouseDragging = false;

    constructor(viewport: Viewport) {
        this.viewport = viewport;
    }

    handlers: HTMLAttributes<HTMLElement> = {
        onpointerdown: (event) => {
            if (event.target === event.currentTarget) {
                this.isMouseDragging = true;
                (event.target as HTMLDivElement).setPointerCapture(
                    event.pointerId,
                );
            }
        },
        onpointerup: (event) => {
            this.isMouseDragging = false;
            (event.target as HTMLDivElement).releasePointerCapture(
                event.pointerId,
            );
        },
        onpointermove: ({ movementX, buttons }) => {
            if (!(buttons & MouseButtons.Primary)) {
                this.isMouseDragging = false;
                return;
            }

            if (!this.isMouseDragging) return;

            const dpr = window.devicePixelRatio || 1;

            this.viewport.scrollLeft = Math.max(
                0,
                this.viewport.scrollLeft - movementX / dpr,
            );
        },
        onwheel: (event) => {
            event.preventDefault();

            const container = event.currentTarget;
            const rect = container.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const oldZoom = this.viewport.zoomLevelSec;
            const timeAtMouseSec = (this.viewport.scrollLeft + mouseX) /
                oldZoom;
            const zoomSpeed = 0.05;
            const delta = -event.deltaY * zoomSpeed;
            const newZoom = Math.max(10, oldZoom + delta);

            this.viewport.zoomLevelMs = newZoom / 1000;

            this.viewport.scrollLeft = Math.max(
                0,
                timeAtMouseSec * newZoom - mouseX,
            );
        },
    };
}
