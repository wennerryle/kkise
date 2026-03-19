<script lang="ts">
	import type { Interval } from '../repos/Repositories.svelte';
	import Grip from 'lucide-svelte/icons/grip';
	import { getViewportContext } from '../viewport-context';
	import { createDraggable } from '$lib/core/dndkit';
	import { IntervalXMoveController } from './IntervalXMoveController';
	import { getIntervalRepository, getTrackRepository } from '../repositories-context';
	import { IntervalResizeController } from './IntervalResizeController';

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
				tag: 'interval' as const,
				trackId
			};
		}
	});

	const intervalRepo = getIntervalRepository();
	const trackRepo = getTrackRepository();
	const track = $derived(trackRepo.tracks.get(trackId)!);

	const intervalMoveController = new IntervalXMoveController({
		intervalRepo,
		get interval() {
			return interval;
		},
		get track() {
			return track;
		},
		viewport
	});

	const intervalResizeController = new IntervalResizeController({
		get interval() {
			return interval;
		},
		viewport
	});
</script>

{#if (left + width > 0 && left < viewport.width) || intervalMoveController.dragging}
	<div
		class={[
			'absolute h-full cursor-default overflow-hidden bg-linear-to-t from-green-300 to-green-200 text-center',
			draggable.isDragging && 'opacity-50'
		]}
		style="left: {left}px; width: {width}px;"
		{@attach draggable.attach}
		role="presentation"
	>
		<div
			class="relative flex h-full w-full items-center gap-2 px-2"
			style="left: {innerPlacementOffset}px; width: {width - innerPlacementOffset}px;"
			{@attach intervalMoveController.attach}
		>
			<div
				class="absolute left-0 h-full w-2 cursor-e-resize bg-transparent transition-colors hover:bg-green-500"
				{@attach intervalResizeController.leftControllerAttachment}
			></div>
			<div
				class="absolute right-0 h-full w-2 cursor-e-resize bg-transparent transition-colors hover:bg-green-500"
				{@attach intervalResizeController.rightControllerAttachment}
			></div>
			<button {@attach draggable.attachHandle} class="cursor-grab">
				<span class="sr-only"> Dragging Area </span>
				<Grip class="size-3.5" />
			</button>
			{interval.id}
		</div>
	</div>
{/if}
