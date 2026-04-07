import type { Attachment } from 'svelte/attachments';
import type { IntervalXMovementCommand } from '../commands/IntervalXMovementCommand';

export class IntervalXMovementController {
	dragging = false;

	createCommand: () => IntervalXMovementCommand;

	constructor(createCommand: () => IntervalXMovementCommand) {
		this.createCommand = createCommand;
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

		if (!target.hasAttribute('data-moveable-x')) return;

		this.dragging = true;

		target.setPointerCapture(event.pointerId);
		target.addEventListener('pointermove', this.onpointermove);

		this.command = this.createCommand();
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
