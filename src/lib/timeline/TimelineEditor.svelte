<script lang="ts">
	import Viewport from './components/Viewport.svelte';
	import { setTimelineContext } from './context/timeline-context';
	import { TimelineContext } from './context/TimelineContext.svelte';

	setTimelineContext(new TimelineContext());
</script>

<Viewport />
