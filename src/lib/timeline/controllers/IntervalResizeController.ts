import type { Attachment } from 'svelte/attachments';
import { IntervalLeftResizeCommand } from '../commands/IntervalLeftResizeCommand';
import { IntervalRightResizeCommand } from '../commands/IntervalRightResizeCommand';
import type { TimelineContext } from '../context/TimelineContext.svelte';
import { lookupAttribute, magicAttributes } from '$lib/core/magic-attributes';

export class IntervalResizeController {
	#ctx: TimelineContext;
	constructor(ctx: TimelineContext) {
		this.#ctx = ctx;
	}

	readonly attach: Attachment<HTMLElement> = (element) => {
		element.addEventListener('pointerdown', this.pointerDown);
		element.addEventListener('pointerup', this.pointerUp);

		return () => {
			element.removeEventListener('pointerdown', this.pointerDown);
			element.removeEventListener('pointerup', this.pointerUp);
			element.removeEventListener('pointermove', this.onRightPointerMove);
			element.removeEventListener('pointermove', this.onLeftPointerMove);
		};
	};

	readonly pointerDown = (event: PointerEvent) => {
		const target = event.target as HTMLElement;

		if (target.hasAttribute(magicAttributes.resizableLeft)) {
			this.initLeftResize(event);
		} else if (target.hasAttribute(magicAttributes.resizableRight)) {
			this.initRightResize(event);
		}
	};

	getAttributes(target: HTMLElement): [intervalId: string, trackId: string] {
		const intervalId = lookupAttribute(target, magicAttributes.intervalId);
		const trackId = lookupAttribute(target, magicAttributes.trackId);

		if (!intervalId || !trackId) {
			throw new Error(`${magicAttributes.intervalId}, ${magicAttributes.trackId} lookup failed`);
		}

		return [intervalId, trackId];
	}

	initLeftResize(event: PointerEvent) {
		const target = event.target as HTMLElement;

		target.setPointerCapture(event.pointerId);
		target.addEventListener('pointermove', this.onLeftPointerMove);

		const [intervalId, trackId] = this.getAttributes(target);
		this.#intervalLeftResizeCommand = new IntervalLeftResizeCommand(intervalId, trackId, this.#ctx);
	}

	initRightResize(event: PointerEvent) {
		const target = event.target as HTMLElement;

		target.setPointerCapture(event.pointerId);
		target.addEventListener('pointermove', this.onRightPointerMove);

		const [intervalId, trackId] = this.getAttributes(target);
		this.#intervalRightResizeCommand = new IntervalRightResizeCommand(
			intervalId,
			trackId,
			this.#ctx
		);
	}

	readonly pointerUp = (event: PointerEvent) => {
		const target = event.target as HTMLElement;

		target.releasePointerCapture(event.pointerId);

		if (target.hasAttribute(magicAttributes.resizableLeft)) {
			target.removeEventListener('pointermove', this.onLeftPointerMove);
			this.#ctx.historyRepository.execute(this.#intervalLeftResizeCommand!);
		} else if (target.hasAttribute(magicAttributes.resizableRight)) {
			target.removeEventListener('pointermove', this.onRightPointerMove);
			this.#ctx.historyRepository.execute(this.#intervalRightResizeCommand!);
		}
	};

	#intervalLeftResizeCommand: IntervalLeftResizeCommand | null = null;

	private readonly onLeftPointerMove = ({ movementX }: PointerEvent) => {
		this.#intervalLeftResizeCommand!.update(movementX);
	};

	#intervalRightResizeCommand: IntervalRightResizeCommand | null = null;

	private readonly onRightPointerMove = ({ movementX }: PointerEvent) => {
		const dpr = window.devicePixelRatio || 1;
		const delta = movementX / dpr;

		this.#intervalRightResizeCommand!.update(delta);
	};
}
