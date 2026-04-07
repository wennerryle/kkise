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

		if (target.hasAttribute('data-resizable-left')) {
			target.setPointerCapture(event.pointerId);
			target.addEventListener('pointermove', this.onLeftPointerMove);
			this.#intervalLeftResizeCommand = this.#leftCommandFabric();
		} else if (target.hasAttribute('data-resizable-right')) {
			target.setPointerCapture(event.pointerId);
			target.addEventListener('pointermove', this.onRightPointerMove);
			this.#intervalRightResizeCommand = this.#rightCommandFabric();
		}
	};

	readonly pointerUp = (event: PointerEvent) => {
		const target = event.target as HTMLElement;

		target.releasePointerCapture(event.pointerId);

		if (target.hasAttribute('data-resizable-left')) {
			target.removeEventListener('pointermove', this.onLeftPointerMove);
		} else if (target.hasAttribute('data-resizable-right')) {
			target.removeEventListener('pointermove', this.onRightPointerMove);
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
