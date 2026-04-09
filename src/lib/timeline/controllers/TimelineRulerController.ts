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

			// We aim to keep the time at the mouse cursor position invariant during zoom.
			// To ensure the cursor stays over the same point in time 't':
			// 1. Before zoom: oldScroll + mouseX = t * oldPixelsPerMs
			// 2. After zoom:  newScroll + mouseX = t * newPixelsPerMs
			// Solving for newScroll:
			// newScroll = t * newPixelsPerMs - mouseX

			const mouseX = event.clientX - event.currentTarget.getBoundingClientRect().left;
			const oldPixelsPerMs = this.timelineCtx.viewport.pixelsPerMs;
			const t = (this.timelineCtx.viewport.scrollLeft + mouseX) / oldPixelsPerMs;

			const zoomSpeed = 0.05;
			const delta = (-event.deltaY * zoomSpeed) / 1000;
			const newPixelsPerMs = Math.max(0.001, oldPixelsPerMs + delta);

			const newScrollLeft = t * newPixelsPerMs - mouseX;

			this.timelineCtx.viewport.pixelsPerMs = newPixelsPerMs;
			this.timelineCtx.viewport.scrollLeft = newScrollLeft;
		}
	};
}
