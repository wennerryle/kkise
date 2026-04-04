<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
	import { type WithoutChildren, useId } from 'bits-ui';
	import { TextareaAutosize } from 'runed';
	import { untrack } from 'svelte';
	import { cn } from '$lib/styles';

	type BaseProps = {
		label?: string;
		id?: string;
		ref?: HTMLElement | null;
		error?: boolean;
		disabled?: boolean;
	};

	type Value = string | number;

	type InputElement = BaseProps &
		WithoutChildren<HTMLInputAttributes> & {
			tag?: 'input';
			type?: HTMLInputAttributes['type'];
			rows?: never;
			cols?: never;
			value?: Value;
		};

	type TextareaElement = BaseProps &
		WithoutChildren<HTMLTextareaAttributes> & {
			tag: 'textarea';
			type?: never;
			value?: Value;
		};

	type Props = InputElement | TextareaElement;

	let {
		label,
		id = $bindable(useId()),
		ref = $bindable(null),
		tag = 'input',
		value = $bindable(''),
		disabled = false,
		error = false,
		class: className,
		...rest
	}: Props = $props();

	let focused = $state(false);
	const isTextarea = $derived(tag === 'textarea');

	$effect(() => {
		if (isTextarea && ref) {
			new TextareaAutosize({
				element: () => untrack(() => ref as HTMLTextAreaElement),
				input: () => value,
				styleProp: 'minHeight'
			});
		}
	});

	const currentState = $derived.by(() => {
		if (disabled) return 'disabled';
		if (error) return 'error';
		if (focused) return 'focused';
		return '';
	});

	const inputStyles = $derived(
		cn(
			'w-full bg-transparent outline-none transition-all placeholder:text-slate-400',
			'text-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed',
			isTextarea ? 'px-4 pb-3 pt-6 resize-none' : 'px-4 pb-2 pt-6',
			!label && (isTextarea ? 'py-3' : 'py-4')
		)
	);

	function handleContainerClick() {
		ref?.focus();
	}
</script>

<!-- Semantically screen readers will perform this okay. -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-has-value={value !== '' || focused}
	data-state={currentState}
	class={cn(
		'group relative flex w-full flex-col overflow-hidden rounded-xl border transition-all duration-200',
		'border-slate-200 bg-slate-50 hover:border-slate-300',
		'data-[state=focused]:border-blue-500 data-[state=focused]:bg-white data-[state=focused]:ring-2 data-[state=focused]:ring-blue-100',
		'data-[state=error]:border-red-500 data-[state=error]:bg-red-50 data-[state=error]:ring-red-100',
		'data-[state=disabled]:border-slate-200 data-[state=disabled]:bg-slate-100 data-[state=disabled]:opacity-70',
		className
	)}
	onclick={handleContainerClick}
>
	{#if label}
		<label
			for={id}
			class={cn(
				'pointer-events-none absolute left-4 z-10 transition-all duration-200 ease-in-out',
				// Позиция по умолчанию (в центре)
				'top-4 text-base text-slate-500',
				// Позиция "вверху" (floating)
				'group-data-[has-value=true]:top-1.5 group-data-[has-value=true]:text-xs',
				// Цвет при фокусе/ошибке
				'group-data-[state=focused]:text-blue-600',
				'group-data-[state=error]:text-red-600',
				'group-data-[state=disabled]:text-slate-400'
			)}
		>
			{label}
		</label>
	{/if}

	{#if tag === 'textarea'}
		<textarea
			class={inputStyles}
			{id}
			bind:value
			bind:focused
			bind:this={ref}
			{disabled}
			aria-invalid={error}
			{...rest as HTMLTextareaAttributes}
		></textarea>
	{:else}
		<input
			class={inputStyles}
			{id}
			bind:value
			bind:focused
			bind:this={ref}
			{disabled}
			aria-invalid={error}
			{...rest as HTMLInputAttributes}
		/>
	{/if}
</div>
