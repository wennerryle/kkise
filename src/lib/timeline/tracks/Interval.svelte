<script lang="ts">
	import type { Interval } from '../repos/Repositories.svelte';
	import Grip from 'lucide-svelte/icons/grip';
	import { getViewportContext } from '../viewport-context';
	import { createDraggable } from '@dnd-kit/svelte';

	interface Props {
		trackId: string;
		interval: Interval;
	}

	const { trackId, interval }: Props = $props();

	const viewport = getViewportContext();

	const left = $derived(interval.offset * viewport.zoomLevelMs - viewport.scrollLeft);
	const width = $derived(interval.duration * viewport.zoomLevelMs);
	const innerPlacementOffset = $derived(left < 0 ? left * -1 : 0);

	const draggable = createDraggable({
		get id() {
			return interval.id;
		},
		get data() {
			return {
				trackId,
				type: 'interval'
			};
		},
		type: 'interval'
	});
</script>

{#if left + width > 0 && left < viewport.width}
	<div
		class={[
			'absolute h-full cursor-default overflow-hidden bg-linear-to-t from-green-300 to-green-200 text-center',
			draggable.isDragging && 'opacity-50'
		]}
		style="left: {left}px; width: {width}px;"
		{@attach draggable.attach}
		data-uuid={interval.id}
	>
		<div
			class="relative flex h-full w-max items-center justify-center gap-2 px-2"
			style="left: {innerPlacementOffset}px;"
		>
			<button {@attach draggable.attachHandle} class="cursor-grab">
				<span class="sr-only"> Dragging Area </span>
				<Grip class="size-3.5" />
			</button>
			{interval.id}
		</div>
	</div>
{/if}
