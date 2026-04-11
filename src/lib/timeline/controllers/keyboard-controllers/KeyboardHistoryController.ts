import { CODE_CONTROL_LEFT, CODE_Y, CODE_Z } from '$lib/core/keycode';
import type { TimelineContext } from '$lib/timeline/context/TimelineContext.svelte';
import { COMMAND_HISTORY_REDO, COMMAND_HISTORY_UNDO } from './commands-constants';
import type { IKeyboardCommand } from './IKeyboardCommand';

// https://w3c.github.io/uievents/tools/key-event-viewer.html
export class KeyboardHistoryController {
	#ctx: TimelineContext;
	#commands: IKeyboardCommand[] = [];
	#handlers = new Map<string, () => void>();
	#pressed = new Set<string>();

	constructor(context: TimelineContext) {
		this.#ctx = context;

		this.#commands.push(
			{
				commandName: COMMAND_HISTORY_UNDO,
				keyCodes: new Set([CODE_CONTROL_LEFT, CODE_Z])
			},
			{
				commandName: COMMAND_HISTORY_REDO,
				keyCodes: new Set([CODE_CONTROL_LEFT, CODE_Y])
			}
		);

		document.addEventListener('keydown', this.#onkeydown);
		document.addEventListener('keyup', this.#onkeyup);

		this.#handlers.set(COMMAND_HISTORY_REDO, this.#redo);
		this.#handlers.set(COMMAND_HISTORY_UNDO, this.#undo);
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

			this.#commands.forEach(({ commandName, keyCodes }) => {
				if (this.#pressed.symmetricDifference(keyCodes).size === 0) {
					this.#handlers.get(commandName)?.();
				}
			});
		}
	};

	#onkeyup = (event: KeyboardEvent) => {
		this.#pressed.delete(event.code);
	};

	destroy() {
		document.removeEventListener('keydown', this.#onkeydown);
		document.removeEventListener('keyup', this.#onkeyup);
	}
}
