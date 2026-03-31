<script lang="ts">
	import { DragDropProvider } from '@dnd-kit/svelte';
	import { getIntervalRepository, getTrackRepository } from '../repositories-context';
	import { dev } from '$app/environment';
	import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
	import Track from './Track.svelte';
	import { DragEndController } from '../controllers/DragEndController';

	const trackRepo = getTrackRepository();
	const intervalRepo = getIntervalRepository();
	const dragEndController = new DragEndController(trackRepo, intervalRepo);
</script>

<!--
	You can read about modifiers here: https://dndkit.com/extend/modifiers
-->
<DragDropProvider
	onDragEnd={dragEndController.onDragEnd}
	modifiers={(it) => [...it, RestrictToVerticalAxis]}
>
	<div class="z-20 h-10 w-0"></div>

	{JSON.stringify(trackRepo.tracksIds)}

	<div class="flex flex-col gap-2">
		{#each trackRepo.tracksIds as trackId, index (trackId)}
			{@const track = trackRepo.tracks.get(trackId)!}
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
