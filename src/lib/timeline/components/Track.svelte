<script lang="ts">
	import { createDroppable, createSortable } from '$lib/core/dndkit';
	import { Popover } from 'bits-ui';
	import { TimelineRulerController } from '../controllers/TimelineRulerController';
	import Interval from './Interval.svelte';
	import { onMount } from 'svelte';
	import { Track } from '../state/Track.svelte';

	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Grip from '@lucide/svelte/icons/grip';
	import { getTimelineContext } from '../context/timeline-context';

	interface Props {
		track: Track;
		index: number;
	}

	const { track, index }: Props = $props();

	let sortable = $state<ReturnType<typeof createSortable>>();

	onMount(() => {
		sortable = createSortable({
			get id() {
				return track.id;
			},
			get index() {
				return index;
			},
			get data() {
				return { tag: 'track' as const, trackId: track.id };
			}
		});
	});

	const trackViewportDroppable = createDroppable({
		get id() {
			return track.id;
		},
		get data() {
			return {
				tag: 'track' as const,
				trackId: track.id
			};
		}
	});

	const timelineCtx = getTimelineContext();

	const timelineRulerController = new TimelineRulerController(timelineCtx);
</script>

<div {@attach sortable?.attach} class="z-10 flex w-full flex-row">
	<div
		style="width: {timelineCtx.viewport.trackHeaderWidth}px;"
		class={[
			'z-20 flex justify-between gap-2 border-y border-r border-slate-200 bg-gray-50 px-2.5 py-1 transition-shadow',
			sortable?.isDragging && 'shadow-2xl'
		]}
	>
		<button {@attach sortable?.attachHandle} class="cursor-grab">
			<span class="sr-only"> Dragging Area </span>
			<Grip class="size-3.5" />
		</button>
		{track.id}
		<Popover.Root>
			<Popover.Trigger
				class="cursor-pointer rounded-sm outline-offset-0 outline-blue-500 aria-expanded:outline-2 aria-expanded:outline-offset-3"
			>
				<span class="sr-only"> Track Header Menu </span>
				<EllipsisVertical />
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					side="bottom"
					sideOffset={10}
					class="z-20 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white text-start"
				>
					<Popover.Root>
						<Popover.Trigger
							class="cursor-pointer px-4 py-1 text-left hover:bg-blue-500 hover:text-white"
						>
							Change button code
						</Popover.Trigger>
						<Popover.Portal>
							<Popover.Content
								side="right"
								sideOffset={4}
								class="z-20 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white text-start"
							>
								<p class="px-4 py-1 text-left">Pick the button</p>
							</Popover.Content>
						</Popover.Portal>
					</Popover.Root>
					<button class="cursor-pointer px-4 py-1 text-left hover:bg-blue-500 hover:text-white">
						Delete Track
					</button>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	</div>
	<div
		class="relative flex-1 cursor-e-resize border-y border-gray-200"
		{@attach trackViewportDroppable.attach}
		{...timelineRulerController.handlers}
	>
		{#each track.intervals as intervalId (intervalId)}
			{@const interval = timelineCtx.intervalRepository.intervals.get(intervalId)!}
			<Interval trackId={track.id} {interval} />
		{/each}
	</div>
</div>
