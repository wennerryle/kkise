<script lang="ts">
	import { Dialog, type DialogContentProps } from 'bits-ui';

	const { children, ...props }: DialogContentProps = $props();
</script>

<Dialog.Content
	{...props}
	class={[
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95',
		'data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full',
		'max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-3xl',
		'border bg-white p-5 shadow-2xl outline-hidden sm:max-w-122.5 md:w-full'
	]}
>
	{@render children?.()}
</Dialog.Content>
