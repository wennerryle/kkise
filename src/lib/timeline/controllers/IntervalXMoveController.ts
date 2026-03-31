import type { Attachment } from 'svelte/attachments';
import { clamp } from 'es-toolkit';
import { Interval } from '../state/Interval.svelte';
import { detectIntervalMovementCollision } from '../logic/collision';
import type { TimelineContext } from '../context/TimelineContext.svelte';

interface IntervalXMoveControllerOptions {
	timelineCtx: TimelineContext;
	interval: Interval;
	trackId: string;
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

		element.addEventListener('pointerdown', this.onpointerdown);
		element.addEventListener('pointerup', this.onpointerup);

		return () => {
			element.removeEventListener('pointerdown', this.onpointerdown);
			element.removeEventListener('pointerup', this.onpointerup);
			element.removeEventListener('pointermove', this.onpointermove);
			this.ref = null;
		};
	};

	relativeMovement = 0;

	onpointerdown = (event: PointerEvent) => {
		if (event.target !== event.currentTarget) return;

		this.dragging = true;

		(event.target as HTMLElement).setPointerCapture(event.pointerId);
		this.ref!.addEventListener('pointermove', this.onpointermove);
		this.relativeMovement = 0;
	};

	onpointerup = (event: PointerEvent) => {
		if (event.target !== event.currentTarget) return;

		this.dragging = false;

		(event.target as HTMLElement).releasePointerCapture(event.pointerId);
		this.ref!.removeEventListener('pointermove', this.onpointermove);
		this.relativeMovement = 0;
	};

	onpointermove = ({ movementX }: PointerEvent) => {
		const dpr = window.devicePixelRatio || 1;

		const relativeMovement = movementX / dpr / this.options.timelineCtx.viewport.zoomLevelMs;

		this.relativeMovement += relativeMovement;

		const offset = clamp(
			this.options.interval.offset + relativeMovement,
			0,
			this.options.timelineCtx.player.totalDuration - this.options.interval.duration
		);

		const proxyInterval = new Interval(
			this.options.interval.id,
			relativeMovement,
			this.options.interval.duration
		);

		const track = this.options.timelineCtx.trackRepository.get(this.options.trackId)!;

		const isCollision = detectIntervalMovementCollision(
			this.options.timelineCtx.intervalRepository,
			track,
			proxyInterval
		);

		if (isCollision) return;

		this.options.interval.offset = offset;
	};
}
