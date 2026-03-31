<script lang="ts">
	import Ruler from './Ruler.svelte';

	import { Viewport } from '../state/Viewport.svelte';
	import TrackList from './TrackList.svelte';
	import { setViewportContext } from '../viewport-context';
	import { setIntervalRepository, setTrackRepository } from '../repositories-context';
	import { IntervalRepository } from '../state/IntervalRepository.svelte';
	import { TrackRepository } from '../state/TrackRepository.svelte';

	setViewportContext(new Viewport());
	setIntervalRepository(new IntervalRepository());
	setTrackRepository(new TrackRepository());
</script>

<div class="relative mx-auto flex h-full flex-col overflow-hidden bg-slate-50 select-none">
	<Ruler />
	<TrackList />
</div>
