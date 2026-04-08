export interface Command {
	execute(): false;
}

export interface Undoable {
	undo(): void;
	execute(): boolean;
}
