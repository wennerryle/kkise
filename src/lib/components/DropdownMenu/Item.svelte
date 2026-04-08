<script lang="ts">
	import { DropdownMenu, type DropdownMenuItemProps } from 'bits-ui';
	import { cn } from '$lib/styles';

	const { children, class: className, ...props }: DropdownMenuItemProps = $props();
</script>

<DropdownMenu.Item
	class={cn(
		'flex cursor-pointer items-center justify-between px-2.5 py-0.5 transition-colors hover:bg-slate-200 aria-disabled:text-gray-300 aria-disabled:hover:cursor-not-allowed aria-disabled:hover:bg-transparent',
		className
	)}
	{...props}
>
	{@render children?.()}
</DropdownMenu.Item>
