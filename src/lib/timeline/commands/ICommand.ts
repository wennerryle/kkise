export interface Command {
	execute(): void;
}

export interface Undoable extends Command {
	undo(): void;
}

export function isUndoable(cmd: Command): cmd is Undoable {
	return 'undo' in cmd;
}
