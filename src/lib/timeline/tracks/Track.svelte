<script lang="ts">
	import { createSortable } from '@dnd-kit/svelte/sortable';
	import Grip from 'lucide-svelte/icons/grip';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import { Popover } from 'bits-ui';
	import { getViewportContext } from '../viewport-context';
	import { TimelineRulerController } from '../core/TimelineRulerController';
	import Interval from './Interval.svelte';
	import { type Track } from '../repos/Repositories.svelte';
	import { getIntervalRepository } from '../repositories-context';

	interface Props {
		track: Track;
		index: number;
	}

	const { track, index }: Props = $props();

	const sortable = createSortable({
		get id() {
			return track.id;
		},
		get index() {
			return index;
		},
		accept: 'item',
		type: 'item'
	});

	const viewport = getViewportContext();
	const timelineRulerController = new TimelineRulerController(viewport);
	const intervalRepo = getIntervalRepository();
</script>

<div {@attach sortable.attach} class="z-10 flex w-full flex-row">
	<div
		style="width: {viewport.trackHeaderWidth}px;"
		class={[
			'z-20 flex justify-between gap-2 border-y border-r border-slate-200 bg-gray-50 px-2.5 py-1 transition-shadow',
			sortable.isDragging && 'shadow-2xl'
		]}
	>
		<button {@attach sortable.attachHandle} class="cursor-grab">
			<span class="sr-only"> Dragging Area </span>
			<Grip class="size-3.5" />
		</button>
		X
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
	<div class="relative flex-1 cursor-e-resize" {...timelineRulerController.handlers}>
		{#each track.intervals as intervalId (intervalId)}
			{@const interval = intervalRepo.intervals.get(intervalId)!}
			<Interval {interval} />
		{/each}
	</div>
</div>
