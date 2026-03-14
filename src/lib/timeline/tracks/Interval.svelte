<script lang="ts">
	import type { Interval } from '../repos/Repositories.svelte';
	import Grip from 'lucide-svelte/icons/grip';
	import { getViewportContext } from '../viewport-context';

	interface Props {
		interval: Interval;
	}

	const { interval }: Props = $props();

	const viewport = getViewportContext();

	const left = $derived(interval.offset * viewport.zoomLevelMs - viewport.scrollLeft);
	const width = $derived(interval.duration * viewport.zoomLevelMs);
	const innerPlacementOffset = $derived(left < 0 ? left * -1 : 0);
</script>

{#if left + width > 0 && left < viewport.width}
	<div
		class="absolute h-full cursor-default bg-linear-to-t from-green-300 to-green-200 text-center"
		style="left: {left}px; width: {width}px; overflow: hidden;"
	>
		<div
			class="relative flex h-full w-max items-center justify-center gap-2 px-2"
			style="left: {innerPlacementOffset}px;"
		>
			<button class="cursor-grab">
				<span class="sr-only"> Dragging Area </span>
				<Grip class="size-3.5" />
			</button>
			{interval.id}
		</div>
	</div>
{/if}
