<script lang="ts">
	import type { Interval } from '../state/Interval.svelte';

	import Grip from '@lucide/svelte/icons/grip';
	import { createDraggable } from '$lib/core/dndkit';
	import { getTimelineContext } from '../context/timeline-context';
	import { IntervalXMovementController } from '../controllers/IntervalXMovementController';
	import { IntervalResizeController } from '../controllers/IntervalResizeController';

	import { IntervalXMovementCommand } from '../commands/IntervalXMovementCommand';
	import { IntervalLeftResizeCommand } from '../commands/IntervalLeftResizeCommand';
	import { IntervalRightResizeCommand } from '../commands/IntervalRightResizeCommand';

	interface Props {
		trackId: string;
		interval: Interval;
	}

	const timelineCtx = getTimelineContext();

	const { trackId, interval }: Props = $props();

	const left = $derived(
		interval.offset * timelineCtx.viewport.pixelsPerMs - timelineCtx.viewport.scrollLeft
	);

	const width = $derived(interval.duration * timelineCtx.viewport.pixelsPerMs);
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

	const intervalMoveController = new IntervalXMovementController(
		() => new IntervalXMovementCommand(timelineCtx, trackId, interval)
	);

	const intervalResizeController = new IntervalResizeController(
		() => new IntervalLeftResizeCommand(interval, trackId, timelineCtx),
		() => new IntervalRightResizeCommand(interval, trackId, timelineCtx)
	);
</script>

{#if (left + width > 0 && left < timelineCtx.viewport.width) || intervalMoveController.dragging}
	<div
		class={[
			'absolute h-full cursor-default overflow-hidden bg-linear-to-t from-green-300 to-green-200 text-center',
			draggable.isDragging && 'opacity-50'
		]}
		style="transform: translateX({left}px); width: {width}px;"
		{@attach draggable.attach}
		role="presentation"
	>
		{#if width > 20}
			<div
				class="relative flex h-full w-full items-center gap-2 px-2"
				style="transform: translateX({innerPlacementOffset}px); width: {width -
					innerPlacementOffset}px;"
				{@attach intervalMoveController.attach}
				{@attach intervalResizeController.attach}
				data-moveable-x
			>
				<button
					class="absolute left-0 h-full w-2 cursor-e-resize bg-transparent transition-colors hover:bg-green-500"
					aria-label="resize left"
					data-resizable-left
				></button>
				<button
					class="absolute right-0 h-full w-2 cursor-e-resize bg-transparent transition-colors hover:bg-green-500"
					aria-label="resize right"
					data-resizable-right
				></button>
				<button {@attach draggable.attachHandle} class="cursor-grab">
					<span class="sr-only"> Dragging Area </span>
					<Grip class="size-3.5" />
				</button>

				<span class="text-nowrap" data-moveable-x>
					{interval.id}
				</span>
			</div>
		{/if}
	</div>
{/if}
