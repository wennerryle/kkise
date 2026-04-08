<script lang="ts">
	import { DragDropProvider } from '@dnd-kit/svelte';
	import { dev } from '$app/environment';
	import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
	import Track from './Track.svelte';
	import { DragEndController } from '../controllers/DragEndController';
	import { getTimelineContext } from '../context/timeline-context';
	import { IntervalXMovementController } from '../controllers/IntervalXMovementController';
	import { IntervalResizeController } from '../controllers/IntervalResizeController';

	const timelineCtx = getTimelineContext();
	const dragEndController = new DragEndController(timelineCtx);

	const intervalMoveController = new IntervalXMovementController(timelineCtx);
	const intervalResizeController = new IntervalResizeController(timelineCtx);
</script>

<!--
	You can read about modifiers here: https://dndkit.com/extend/modifiers
-->
<DragDropProvider
	onDragEnd={dragEndController.onDragEnd}
	modifiers={(it) => [...it, RestrictToVerticalAxis]}
>
	<div class="z-20 h-5 w-0"></div>

	<div
		class="flex flex-col gap-2"
		{@attach intervalMoveController.attach}
		{@attach intervalResizeController.attach}
	>
		{#each timelineCtx.trackRepository.tracksIds as trackId, index (trackId)}
			{@const track = timelineCtx.trackRepository.tracks.get(trackId)!}
			{#if dev}
				{(() => {
					// Makes update always dirty, so page isn't freezes. Look at #8 for more info
					return null;
				})()}
			{/if}
			<Track {track} {index} />
		{/each}
	</div>
</DragDropProvider>
