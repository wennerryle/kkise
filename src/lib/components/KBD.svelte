<script lang="ts">
	import { cn } from '$lib/styles';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		keys: string[];
	} & SvelteHTMLElements['div'];

	const { keys, class: className }: Props = $props();
</script>

<div class={cn('flex items-center gap-px', className)}>
	{#each keys as key, i (i)}
		<kbd
			class="pointer-events-none hidden h-5 items-center gap-1 rounded-sm border border-gray-300 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-800 opacity-100 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.08)] select-none sm:flex"
		>
			{#if key === '⌘'}
				<span class="text-[13px] leading-none">⌘</span>
			{:else}
				{key}
			{/if}
		</kbd>
	{/each}
</div>
