<script lang="ts" generics="const T extends v.GenericSchema">
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import * as v from 'valibot';
	import { form2object, stopEvent } from '$lib/core/dom';
	import { mergeProps } from 'bits-ui';
	import { setFormErrorsContext } from '../helpers';
	import { ref as boxed, type Ref } from '$lib/core/ref';
	import { unstable_coerceFormValue } from '@conform-to/valibot';
	import { toast } from 'svelte-sonner';

	type SchemaKeys = keyof v.InferInput<T>;
	type Errors = Partial<Record<SchemaKeys, string[]>>;

	interface Props extends Omit<HTMLFormAttributes, 'children'> {
		schema: T;
		ref?: HTMLFormElement | null;
		children: Snippet;
		errors?: Ref<Errors>;
		prefix?: string;
		/** Allow to check schema from not-supported sources */
		test?: object;
		onSuccessSubmit?: (value: v.InferInput<T>) => void;
	}

	let {
		children,
		schema,
		ref = $bindable(null),
		errors = $bindable(boxed({})),
		onSuccessSubmit,
		prefix,
		test,
		...rest
	}: Props = $props();

	setFormErrorsContext(errors);

	const valibotProps = {
		onsubmit(event: SubmitEvent) {
			stopEvent(event);

			const data = form2object(ref!);

			if (prefix !== undefined) {
				const prefixLength = prefix.length;

				for (const key in data) {
					if (key.startsWith(prefix)) {
						const value = data[key];

						delete data[key];

						data[key.slice(prefixLength)] = value;
					}
				}
			}

			if (test) {
				Object.assign(data, test);
			}

			const parseResult = v.safeParse(unstable_coerceFormValue(schema), data);

			if (parseResult.issues !== undefined) {
				errors.value = v.flatten(parseResult.issues).nested as Errors;
				toast.error('Form Validation failed. Check console if error not shown in UI');
				console.log($state.snapshot(errors.value));
			} else {
				errors.value = {};
				onSuccessSubmit?.(parseResult.output as v.InferInput<T>);
			}
		}
	};

	const mergedProps = $derived(mergeProps(valibotProps, rest));
</script>

<form bind:this={ref} {...mergedProps}>
	{@render children()}
</form>
