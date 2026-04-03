<script lang="ts">
	import { Select, type SelectContentProps } from 'bits-ui';

	let { children, class: className, ...props }: SelectContentProps = $props();
</script>

<Select.Content
	{...props}
	sideOffset={8}
	class={[
		'z-50 w-(--bits-select-anchor-width) rounded-xl border border-gray-100 bg-white p-1 shadow-lg outline-hidden',
		'data-[state=closed]:animate-out data-[state=open]:animate-in',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
		className
	]}
>
	<Select.Viewport class="flex w-full flex-col gap-1">
		{@render children?.()}
	</Select.Viewport>
</Select.Content>
