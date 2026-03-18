<script lang="ts">
	import { DragDropProvider } from '@dnd-kit/svelte';
	import type { DnDData, DnDEvents } from '$lib/core/dndkit';
	import { getTrackRepository } from '../repositories-context';
	import { move } from '@dnd-kit/helpers';
	import { dev } from '$app/environment';
	import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
	import Track from './Track.svelte';

	const trackRepo = getTrackRepository();

	const onDragEnd: DnDEvents['onDragEnd'] = (event) => {
		const sourceId = event.operation.source?.id as string;
		const targetId = event.operation.target?.id as string;

		if (sourceId === targetId) return;

		const sourceData = event.operation.source?.data as DnDData | undefined;
		const targetData = event.operation.target?.data as DnDData | undefined;

		if (!sourceData || !targetData) return;

		if (sourceData.tag === 'track' && targetData.tag === 'track') {
			// Tracks is sortable, intervals are draggable.
			trackRepo.tracksIds = move(trackRepo.tracksIds, event);
			return;
		}

		if (sourceData.tag === 'interval' || targetData.tag === 'track') {
			if (sourceData.trackId === targetData.trackId) return;

			const sourceTrack = trackRepo.tracks.get(sourceData.trackId)!;
			const targetTrack = trackRepo.tracks.get(targetData.trackId)!;

			sourceTrack.intervals = sourceTrack.intervals.filter((it) => it !== sourceId);

			targetTrack.intervals.push(sourceId);
		}
	};
</script>

<!--
	You can read about modifiers here: https://dndkit.com/extend/modifiers
-->
<DragDropProvider {onDragEnd} modifiers={(it) => [...it, RestrictToVerticalAxis]}>
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
