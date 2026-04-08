<script lang="ts">
	import { DropdownMenu, type DropdownMenuGroupHeadingProps } from 'bits-ui';
	import { cn } from '$lib/styles';

	const { children, class: className, ...props }: DropdownMenuGroupHeadingProps = $props();
</script>

<DropdownMenu.GroupHeading class={cn('flex items-center gap-2 px-3 py-2', className)} {...props}>
	<span class="shrink-0 text-[10px] font-bold tracking-tighter text-indigo-500 uppercase">
		{@render children?.()}
	</span>
	<div class="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
</DropdownMenu.GroupHeading>
