<script lang="ts">
	import { DragDropProvider } from '@dnd-kit/svelte';
	import type { DnDEvents } from './dnd-kit-types';
	import Track from './Track.svelte';
	import { getTrackRepository } from '../repositories-context';
	import { move } from '@dnd-kit/helpers';
	import { dev } from '$app/environment';

	const trackRepo = getTrackRepository();

	const onDragEnd: DnDEvents['onDragEnd'] = async (event) => {
		trackRepo.tracksIds = move(trackRepo.tracksIds, event);
	};
</script>

<DragDropProvider {onDragEnd}>
	<div class="z-20 h-10 w-0"></div>

	{JSON.stringify(trackRepo.tracksIds)}

	<div class="flex flex-col gap-2">
		{#each trackRepo.tracksIds as trackId, index (trackId)}
			{@const track = trackRepo.tracks.get(trackId)!}
			{#if dev}
				{(() => {
					return null;
				})()}
			{/if}
			<Track {track} {index} />
		{/each}
	</div>
</DragDropProvider>
