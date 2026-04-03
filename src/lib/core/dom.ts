export type Getter<T> = () => T;
export type MaybeGetter<T> = T | Getter<T>;

export function form2object(form: HTMLFormElement) {
	const entries: Record<string, FormDataEntryValue | undefined> = Object.fromEntries(
		new FormData(form)
	);

	for (const key in entries) {
		// Forms cannot have undefined values, so they're empty
		// We have to convert them manually to undefined
		if (entries[key] === '') entries[key] = undefined;
	}

	return entries;
}

export function stopEvent(event: Event) {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
}

export type MaybeElementGetter<T extends Element = HTMLElement> = MaybeGetter<T | null | undefined>;
