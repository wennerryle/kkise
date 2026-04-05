<script lang="ts">
	import { DragDropProvider } from '@dnd-kit/svelte';
	import { dev } from '$app/environment';
	import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
	import Track from './Track.svelte';
	import { DragEndController } from '../controllers/DragEndController';
	import { getTimelineContext } from '../context/timeline-context';

	const timelineCtx = getTimelineContext();
	const dragEndController = new DragEndController(timelineCtx);
</script>

<!--
	You can read about modifiers here: https://dndkit.com/extend/modifiers
-->
<DragDropProvider
	onDragEnd={dragEndController.onDragEnd}
	modifiers={(it) => [...it, RestrictToVerticalAxis]}
>
	<div class="z-20 h-5 w-0"></div>

	<div class="flex flex-col gap-2">
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
