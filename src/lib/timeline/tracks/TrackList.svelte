<script lang="ts">
	import { DragDropProvider } from '@dnd-kit/svelte';
	import type { DnDEvents } from './dnd-kit-types';
	import Track from './Track.svelte';
	import { getTrackRepository } from '../repositories-context';

	const onDragEnd: DnDEvents['onDragEnd'] = (event) => {
		if (event.canceled) return;
	};

	const trackRepo = getTrackRepository();
</script>

<DragDropProvider {onDragEnd}>
	<div class="z-20 h-10 w-0"></div>

	{#each trackRepo.tracksIds as trackId, i (trackId)}
		{@const track = trackRepo.tracks.get(trackId)!}
		<Track {track} index={i} />
	{/each}
</DragDropProvider>
