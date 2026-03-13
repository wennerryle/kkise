<script lang="ts">
	import type { Interval } from '../repos/Repositories.svelte';
	import { getViewportContext } from '../viewport-context';

	interface Props {
		interval: Interval;
	}

	const { interval }: Props = $props();

	const viewport = getViewportContext();

	const left = $derived(interval.offset * viewport.zoomLevelMs - viewport.scrollLeft);
	const width = $derived(interval.duration * viewport.zoomLevelMs);
</script>

{#if left + width > 0 && left < viewport.width}
	<div
		class="absolute flex cursor-grab items-center justify-center bg-linear-to-t from-green-300 to-green-200 py-1 text-center"
		style="left: {left}px; width: {width}px"
	>
		{interval.id}
	</div>
{/if}
