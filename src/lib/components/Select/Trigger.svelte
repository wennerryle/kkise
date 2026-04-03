<script lang="ts">
	import { Select, type SelectTriggerProps } from 'bits-ui';
	import { cn } from '$lib/styles';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	type Props = SelectTriggerProps & {
		label?: string;
		error?: boolean;
		value?: string;
	};

	let { children, class: className, label, error, value, ...props }: Props = $props();
</script>

<Select.Trigger
	{...props}
	class={cn(
		'group relative flex h-14 w-full items-center overflow-hidden rounded-xl border transition-all duration-200',
		'border-slate-200 bg-slate-50 text-left outline-none hover:border-slate-300',

		'focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100',
		'data-[state=open]:border-blue-500 data-[state=open]:bg-white',

		error && 'border-red-500 bg-red-50 ring-red-100',

		'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70',

		className
	)}
>
	{#if label}
		<span
			class={cn(
				'pointer-events-none absolute left-4 transition-all duration-200 ease-in-out',
				'top-4 text-base text-slate-500',
				(value || props['aria-expanded'] === 'true') && 'top-1.5 text-xs text-blue-600',
				error && 'text-red-600'
			)}
		>
			{label}
		</span>
	{/if}

	<span class={cn('w-full px-4 text-base text-slate-900 transition-all', label ? 'pt-4' : 'pt-0')}>
		{@render children?.()}
	</span>

	<div class="pr-4 text-slate-400 transition-colors group-hover:text-slate-600">
		<ChevronDown />
	</div>
</Select.Trigger>
