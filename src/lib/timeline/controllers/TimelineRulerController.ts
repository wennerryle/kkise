import { MouseButtons } from '../logic/constants.ts';
import type { HTMLAttributes } from 'svelte/elements';
import type { TimelineContext } from '../context/TimelineContext.svelte.ts';

export class TimelineRulerController {
	timelineCtx: TimelineContext;

	isMouseDragging = false;

	constructor(timelineCtx: TimelineContext) {
		this.timelineCtx = timelineCtx;
	}

	readonly handlers: HTMLAttributes<HTMLElement> = {
		onpointerdown: (event) => {
			if (event.target === event.currentTarget) {
				this.isMouseDragging = true;
				(event.target as HTMLDivElement).setPointerCapture(event.pointerId);
			}
		},
		onpointerup: (event) => {
			this.isMouseDragging = false;
			(event.target as HTMLDivElement).releasePointerCapture(event.pointerId);
		},
		onpointermove: ({ movementX, buttons }) => {
			if (!(buttons & MouseButtons.Primary)) {
				this.isMouseDragging = false;
				return;
			}

			if (!this.isMouseDragging) return;

			const dpr = window.devicePixelRatio || 1;

			this.timelineCtx.viewport.scrollLeft = Math.max(
				0,
				this.timelineCtx.viewport.scrollLeft - movementX / dpr
			);
		},
		onwheel: (event) => {
			event.preventDefault();

			const mouseX = event.clientX - event.currentTarget.getBoundingClientRect().left;
			const oldZoom = this.timelineCtx.viewport.pixelsPerMs;
			const timeAtMouseMs = (this.timelineCtx.viewport.scrollLeft + mouseX) / oldZoom;
			const zoomSpeed = 0.05;
			const delta = (-event.deltaY * zoomSpeed) / 1000;

			const newZoom = oldZoom + delta;

			this.timelineCtx.viewport.pixelsPerMs = newZoom;
			this.timelineCtx.viewport.scrollLeft = timeAtMouseMs * newZoom - mouseX;
		}
	};
}
