import type { Attachment } from 'svelte/attachments';
import type { IntervalLeftResizeCommand } from '../commands/IntervalLeftResizeCommand';
import type { IntervalRightResizeCommand } from '../commands/IntervalRightResizeCommand';

export class IntervalResizeController {
	readonly #leftCommandFabric: () => IntervalLeftResizeCommand;
	readonly #rightCommandFabric: () => IntervalRightResizeCommand;

	constructor(
		leftCommandFabric: () => IntervalLeftResizeCommand,
		rightCommandFabric: () => IntervalRightResizeCommand
	) {
		this.#leftCommandFabric = leftCommandFabric;
		this.#rightCommandFabric = rightCommandFabric;
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

	#intervalLeftResizeCommand: IntervalLeftResizeCommand | null = null;

	private readonly onLeftPointerDown = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);
		target.addEventListener('pointermove', this.onLeftPointerMove);
		this.#intervalLeftResizeCommand = this.#leftCommandFabric();
	};

	private readonly onLeftPointerUp = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		target.releasePointerCapture(event.pointerId);
		target.removeEventListener('pointermove', this.onLeftPointerMove);
		this.#intervalLeftResizeCommand!.execute();
	};

	private readonly onLeftPointerMove = ({ movementX }: PointerEvent) => {
		this.#intervalLeftResizeCommand!.update(movementX);
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

	#intervalRightResizeCommand: IntervalRightResizeCommand | null = null;

	private readonly onRightPointerDown = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		target.setPointerCapture(event.pointerId);
		target.addEventListener('pointermove', this.onRightPointerMove);
		this.#intervalRightResizeCommand = this.#rightCommandFabric();
	};

	private readonly onRightPointerUp = (event: PointerEvent) => {
		const target = event.target as HTMLElement;
		target.releasePointerCapture(event.pointerId);
		target.removeEventListener('pointermove', this.onRightPointerMove);
		this.#intervalRightResizeCommand!.execute();
	};

	private readonly onRightPointerMove = ({ movementX }: PointerEvent) => {
		const dpr = window.devicePixelRatio || 1;
		const delta = movementX / dpr;

		this.#intervalRightResizeCommand!.update(delta);
	};
}
