import type { Attachment } from 'svelte/attachments';
import type { IntervalXMovementCommand } from '../commands/IntervalXMovementCommand';

interface IntervalXMoveControllerOptions {
	createCommand: () => IntervalXMovementCommand;
}

export class IntervalXMovementController {
	ref: HTMLElement | null = null;
	options: IntervalXMoveControllerOptions;

	dragging = false;

	constructor(options: IntervalXMoveControllerOptions) {
		this.options = options;
	}

	readonly attach: Attachment<HTMLElement> = (element) => {
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

	command: IntervalXMovementCommand | null = null;

	private readonly onpointerdown = (event: PointerEvent) => {
		if (event.target !== event.currentTarget) return;

		this.dragging = true;

		(event.target as HTMLElement).setPointerCapture(event.pointerId);
		this.ref!.addEventListener('pointermove', this.onpointermove);

		this.command = this.options.createCommand();
	};

	private readonly onpointerup = (event: PointerEvent) => {
		if (event.target !== event.currentTarget) return;

		this.dragging = false;

		(event.target as HTMLElement).releasePointerCapture(event.pointerId);
		this.ref!.removeEventListener('pointermove', this.onpointermove);
		this.command = null;
	};

	private readonly onpointermove = ({ movementX }: PointerEvent) => {
		const dpr = window.devicePixelRatio || 1;
		const relativeMovement = movementX / dpr;

		this.command!.execute(relativeMovement);
	};
}
