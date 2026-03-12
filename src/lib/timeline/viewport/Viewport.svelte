<script lang="ts">
	import Ruler from './Ruler.svelte';

	import { Viewport } from '../core/Viewport.svelte';
	import TrackList from '../tracks/TrackList.svelte';
	import { setViewportContext } from '../viewport-context';

	const viewport = new Viewport();
	setViewportContext(viewport);
</script>

<div class="relative mx-auto flex h-full flex-col overflow-hidden bg-slate-50 select-none">
	<Ruler />
	<TrackList />
</div>
