import { CODE_CONTROL_LEFT, CODE_Y, CODE_Z } from '$lib/core/keycode';
import type { TimelineContext } from '../context/TimelineContext.svelte';

interface KeyboardCommand {
	command: () => void;
	keyCodes: Set<string>;
}

// https://w3c.github.io/uievents/tools/key-event-viewer.html
export class KeyboardController {
	#ctx: TimelineContext;
	#commands: KeyboardCommand[] = [];
	#pressed = new Set<string>();

	constructor(context: TimelineContext) {
		this.#ctx = context;

		this.#commands.push(
			{
				command: this.#undo,
				keyCodes: new Set([CODE_CONTROL_LEFT, CODE_Z])
			},
			{
				command: this.#redo,
				keyCodes: new Set([CODE_CONTROL_LEFT, CODE_Y])
			}
		);

		document.addEventListener('keydown', this.#onkeydown);
		document.addEventListener('keyup', this.#onkeyup);
	}

	#undo = () => {
		this.#ctx.historyRepository.undo();
	};

	#redo = () => {
		this.#ctx.historyRepository.redo();
	};

	#onkeydown = (event: KeyboardEvent) => {
		if (!event.repeat) {
			this.#pressed.add(event.code);

			this.#commands.forEach(({ command, keyCodes }) => {
				if (this.#pressed.symmetricDifference(keyCodes).size === 0) {
					command();
				}
			});
		}
	};

	#onkeyup = (event: KeyboardEvent) => {
		this.#pressed.delete(event.code);
	};

	destroy() {}
}
