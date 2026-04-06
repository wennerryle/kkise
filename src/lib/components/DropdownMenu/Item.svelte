<script lang="ts">
	import { DropdownMenu, type DropdownMenuItemProps } from 'bits-ui';
	import { cn } from '$lib/styles';

	const { children, class: className, ...props }: DropdownMenuItemProps = $props();
</script>

<DropdownMenu.Item
	class={cn(
		'flex cursor-pointer items-center justify-center px-2.5 transition-colors hover:bg-slate-200',
		className
	)}
	{...props}
>
	{@render children?.()}
</DropdownMenu.Item>
