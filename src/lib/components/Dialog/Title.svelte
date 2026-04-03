<script lang="ts">
	import { Dialog, type DialogTitleProps } from 'bits-ui';

	const { children, ...props }: DialogTitleProps = $props();
</script>

<Dialog.Title
	{...props}
	class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
>
	{@render children?.()}
</Dialog.Title>
