<script lang="ts">
	import type { UniqueIdentifier } from '$lib/core/types';
	import { createSortable } from '@dnd-kit/svelte/sortable';
	import Grip from 'lucide-svelte/icons/grip';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import { Popover } from 'bits-ui';
	import { getViewportContext } from '../viewport-context';
	import { TimelineRulerController } from '../core/TimelineRulerController';

	interface Props {
		id: UniqueIdentifier;
		index: number;
		buttonKey: string;
		onChangeButtonCode: (code: string) => void;
		onTrackDelete: (code: UniqueIdentifier) => void;
	}

	const { buttonKey, index, id, onChangeButtonCode, onTrackDelete }: Props = $props();

	const sortable = createSortable({
		get id() {
			return id;
		},
		get index() {
			return index;
		},
		accept: 'item',
		type: 'item'
	});

	const viewport = getViewportContext();
	const timelineRulerController = new TimelineRulerController(viewport);
</script>

<div {@attach sortable.attach} class="z-10 flex w-full flex-row">
	<div
		style="max-width: {viewport.trackWidth}px; min-width: {viewport.trackWidth}px;"
		class={[
			'flex justify-between gap-2 border-r border-b border-slate-200 bg-gray-50/80 px-2.5 py-1 transition-shadow',
			sortable.isDragging && 'shadow-2xl'
		]}
	>
		<button {@attach sortable.attachHandle} class="cursor-grab">
			<span class="sr-only"> Dragging Area </span>
			<Grip class="size-3.5" />
		</button>
		{buttonKey}
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
	<div class="h-full w-full" {...timelineRulerController.handlers}>rest of timeline</div>
</div>
