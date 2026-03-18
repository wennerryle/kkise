<script lang="ts">
	import { DragDropProvider } from '@dnd-kit/svelte';
	import type { DnDEvents } from '$lib/core/dndkit';
	import { getTrackRepository } from '../repositories-context';
	import { move } from '@dnd-kit/helpers';
	import { dev } from '$app/environment';
	import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
	import Track from './Track.svelte';

	const trackRepo = getTrackRepository();

	const onDragEnd: DnDEvents['onDragEnd'] = async (event) => {
		const sourceId = event.operation.source?.id as string;
		// const sourceData = event.operation.target!.data as DnDData;

		console.log({ source: event.operation.source!.data, target: event.operation.target!.data });

		if (sourceId.includes('#sortable')) {
			// Tracks is sortable, intervals are draggable.
			trackRepo.tracksIds = move(trackRepo.tracksIds, event);
			console.log('sortable... sourceId:', sourceId);
		} else {
			console.log('otherwise... sourceId:', sourceId);
		}
	};
</script>

<!--
	You can read about modifiers here: https://dndkit.com/extend/modifiers
-->
<DragDropProvider {onDragEnd} modifiers={[RestrictToVerticalAxis]}>
	<div class="z-20 h-10 w-0"></div>

	{JSON.stringify(trackRepo.tracksIds)}

	<div class="flex flex-col gap-2">
		{#each trackRepo.tracksIds as trackId, index (trackId)}
			{@const track = trackRepo.tracks.get(trackId)!}
			{#if dev}
				{(() => {
					// dirty hack
					return null;
				})()}
			{/if}
			<Track {track} {index} />
		{/each}
	</div>
</DragDropProvider>
