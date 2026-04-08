import type { Undoable } from '../commands/ICommand';

export class HistoryRepository {
	#undoStack: Undoable[] = $state([]);
	#redoStack: Undoable[] = $state([]);

	#canRedo = $derived(this.#redoStack.length > 0);
	#canUndo = $derived(this.#undoStack.length > 0);

	get canRedo() {
		return this.#canRedo;
	}

	get canUndo() {
		return this.#canUndo;
	}

	public execute(command: Undoable): void {
		const isUndoable = command.execute();

		if (isUndoable) {
			this.#undoStack.push(command);
			this.#redoStack = [];
		}
	}

	public undo(): void {
		const command = this.#undoStack.pop();
		if (command) {
			command.undo();
			this.#redoStack.push(command);
		}
	}

	public redo(): void {
		const command = this.#redoStack.pop();
		if (command) {
			command.execute();
			this.#undoStack.push(command);
		}
	}

	public clear(): void {
		this.#undoStack = [];
		this.#redoStack = [];
	}
}
