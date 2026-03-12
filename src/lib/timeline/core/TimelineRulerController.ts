import { MouseButtons } from "./constants.ts";
import type { Viewport } from "./Viewport.svelte.ts";
import type { HTMLAttributes } from "svelte/elements";

export class TimelineRulerController {
    viewport: Viewport;

    isMouseDragging = false;

    constructor(viewport: Viewport) {
        this.viewport = viewport;
    }

    handlers: HTMLAttributes<HTMLElement> = {
        onmousedown: () => {
            this.isMouseDragging = true;
        },
        onmouseup: () => {
            this.isMouseDragging = false;
        },
        onmousemove: ({ movementX, buttons }) => {
            if (!(buttons & MouseButtons.Primary)) {
                this.isMouseDragging = false;
            }
            if (!this.isMouseDragging) return;
            this.viewport.scrollLeft = Math.max(
                0,
                this.viewport.scrollLeft - movementX,
            );
        },
        onwheel: (event) => {
            event.preventDefault();

            const container = event.currentTarget;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const oldZoom = this.viewport.zoomLevel;
            const timeAtMouse = (this.viewport.scrollLeft + mouseX) / oldZoom;
            const zoomSpeed = 0.05;
            const delta = -event.deltaY * zoomSpeed;
            const newZoom = Math.max(10, oldZoom + delta);

            this.viewport.zoomLevel = newZoom;

            this.viewport.scrollLeft = Math.max(
                0,
                timeAtMouse * newZoom - mouseX,
            );
        },
    };
}
