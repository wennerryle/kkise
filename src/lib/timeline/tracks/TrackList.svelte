<script lang="ts">
	import { DragDropProvider } from '@dnd-kit/svelte';
	import type { DnDEvents } from './dnd-kit-types';
	import type { UniqueIdentifier } from '$lib/core/types';
	import Track from './Track.svelte';

	const onDragEnd: DnDEvents['onDragEnd'] = (event) => {
		if (event.canceled) return;
	};
</script>

<DragDropProvider {onDragEnd}>
	<div class="z-20 h-8.75 w-0"></div>
	{#each { length: 8 } as _, i}
		<Track
			buttonKey="Track {i + 1}"
			id={crypto.randomUUID()}
			index={i}
			onChangeButtonCode={() => {}}
			onTrackDelete={() => {}}
		/>
	{/each}
</DragDropProvider>
