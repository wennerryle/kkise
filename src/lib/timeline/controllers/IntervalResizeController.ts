import type { Attachment } from 'svelte/attachments';
import { clamp } from 'es-toolkit';
import type { Interval } from '../state/Interval.svelte';
import type { TimelineContext } from '../context/TimelineContext.svelte';

interface IntervalResizeControllerOptions {
	interval: Interval;
	timelineCtx: TimelineContext;
}

export class IntervalResizeController {
	readonly options: IntervalResizeControllerOptions;

	constructor(options: IntervalResizeControllerOptions) {
		this.options = options;
	}

	readonly leftControllerAttachment: Attachment<HTMLElement> = (element) => {
		element.addEventListener('pointerdown', this.onLeftPointerDown);
		element.addEventListener('pointerup', this.onLeftPointerUp);

		return () => {
			element.removeEventListener('pointerdown', this.onLeftPointerDown);
			element.removeEventListener('pointerup', this.onLeftPointerUp);
			element.removeEventListener('pointermove', this.onLeftPointerMove);
		};
	};

	private readonly onLeftPointerDown = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);
		target.addEventListener('pointermove', this.onLeftPointerMove);
	};

	private readonly onLeftPointerUp = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		target.releasePointerCapture(event.pointerId);
		target.removeEventListener('pointermove', this.onLeftPointerMove);
	};

	private readonly onLeftPointerMove = ({ movementX }: PointerEvent) => {
		const dpr = window.devicePixelRatio || 1;
		const delta = movementX / dpr / this.options.timelineCtx.viewport.zoomLevelMs;

		const { offset, duration } = this.options.interval;

		let safeDelta = delta;

		if (offset + safeDelta < 0) {
			safeDelta = -offset;
		}

		if (duration - safeDelta < 200) {
			safeDelta = duration - 200;
		}

		this.options.interval.duration -= safeDelta;
		this.options.interval.offset += safeDelta;
	};

	readonly rightControllerAttachment: Attachment<HTMLElement> = (element) => {
		element.addEventListener('pointerdown', this.onRightPointerDown);
		element.addEventListener('pointerup', this.onRightPointerUp);

		return () => {
			element.removeEventListener('pointerdown', this.onRightPointerDown);
			element.removeEventListener('pointerup', this.onRightPointerUp);
			element.removeEventListener('pointermove', this.onRightPointerMove);
		};
	};

	private readonly onRightPointerDown = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);
		target.addEventListener('pointermove', this.onRightPointerMove);
	};

	private readonly onRightPointerUp = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		target.releasePointerCapture(event.pointerId);
		target.removeEventListener('pointermove', this.onRightPointerMove);
	};

	private readonly onRightPointerMove = ({ movementX }: PointerEvent) => {
		const dpr = window.devicePixelRatio || 1;
		const delta = movementX / dpr / this.options.timelineCtx.viewport.zoomLevelMs;

		const { offset, duration } = this.options.interval;
		const { totalDuration } = this.options.timelineCtx.player;

		const maxAvailable = totalDuration - offset;

		this.options.interval.duration = clamp(duration + delta, 200, maxAvailable);
	};
}
