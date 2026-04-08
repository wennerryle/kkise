import type { Attachment } from 'svelte/attachments';
import { IntervalXMovementCommand } from '../commands/IntervalXMovementCommand';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import { lookupAttribute, magicAttributes } from '$lib/core/magic-attributes';

export class IntervalXMovementController {
	dragging = false;
	#ctx: TimelineContext;

	constructor(ctx: TimelineContext) {
		this.#ctx = ctx;
	}

	readonly attach: Attachment<HTMLElement> = (element) => {
		element.addEventListener('pointerdown', this.onpointerdown);
		element.addEventListener('pointerup', this.onpointerup);

		return () => {
			element.removeEventListener('pointerdown', this.onpointerdown);
			element.removeEventListener('pointerup', this.onpointerup);
			element.removeEventListener('pointermove', this.onpointermove);
		};
	};

	command: IntervalXMovementCommand | null = null;

	private readonly onpointerdown = (event: PointerEvent) => {
		const target = event.target as HTMLElement;

		if (!target.hasAttribute(magicAttributes.moveableX)) return;

		const trackId = lookupAttribute(target, magicAttributes.trackId);

		if (!trackId) {
			throw new Error(`No ${magicAttributes.trackId} found in the tree above`);
		}

		const intervalId = lookupAttribute(target, magicAttributes.intervalId);

		if (!intervalId) {
			throw new Error(`No ${magicAttributes.intervalId} found in the tree above`);
		}

		const interval = this.#ctx.intervalRepository.get(intervalId)!;

		this.command = new IntervalXMovementCommand(this.#ctx, trackId, interval);

		this.dragging = true;
		target.setPointerCapture(event.pointerId);
		target.addEventListener('pointermove', this.onpointermove);
	};

	private readonly onpointerup = (event: PointerEvent) => {
		const target = event.target as HTMLElement;

		if (!target.hasAttribute('data-moveable-x')) return;

		this.dragging = false;

		target.releasePointerCapture(event.pointerId);
		target.removeEventListener('pointermove', this.onpointermove);
		this.command = null;
	};

	private readonly onpointermove = ({ movementX }: PointerEvent) => {
		const dpr = window.devicePixelRatio || 1;
		const relativeMovement = movementX / dpr;

		this.command!.update(relativeMovement);
	};
}
