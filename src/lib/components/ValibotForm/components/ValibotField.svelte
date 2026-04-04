<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { getFormErrorsContext } from '../helpers';
	import Textarea from '$lib/components/Textarea.svelte';
	import ValibotErrors from './ValibotErrors.svelte';

	type FieldProps = ComponentProps<typeof Textarea> & {
		name: string;
		value?: string | number;
	};

	let { name, value = $bindable(''), ...rest }: FieldProps = $props();

	const errorsContext = getFormErrorsContext();

	const errors = $derived(errorsContext.value?.[name]);
	const error = $derived(errors && errors.length > 0);
</script>

<div class="flex flex-col gap-2">
	<Textarea bind:value {...rest} {error} {name} />
	{#if errors}
		<ValibotErrors {errors} />
	{/if}
</div>
