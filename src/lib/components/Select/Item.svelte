<script lang="ts">
	import { cn } from '$lib/styles';
	import { Select, type SelectItemProps } from 'bits-ui';
	import Check from '@lucide/svelte/icons/check';

	interface MySelectItemProps extends SelectItemProps {
		selected?: boolean;
		highlighted?: boolean;
	}

	let {
		children,
		class: className,
		highlighted = false,
		selected = false,
		...props
	}: MySelectItemProps = $props();
</script>

<Select.Item
	class={cn(
		'relative flex cursor-default items-center rounded-lg px-3 py-2.5 text-sm outline-hidden transition-colors select-none',
		'text-slate-700 hover:bg-slate-100 focus:bg-blue-50 focus:text-blue-700',
		'data-selected:bg-blue-50 data-selected:font-medium data-selected:text-blue-700',
		'group disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...props}
>
	{@render children?.({
		highlighted,
		selected
	})}

	<Check class="ml-auto hidden size-5 group-data-selected:block" />
</Select.Item>
