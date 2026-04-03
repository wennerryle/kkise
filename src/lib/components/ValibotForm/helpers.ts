import type { Ref } from '$lib/core/ref';
import { createContext } from 'svelte';

type FormErrorsContext = Ref<Record<string, string[] | undefined>>;

export const [getFormErrorsContext, setFormErrorsContext] = createContext<FormErrorsContext>();

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
