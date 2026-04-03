<script lang="ts">
	import InsertIntervalsDialog from './components/dialogs/InsertIntervalsDialog.svelte';
	import Viewport from './components/Viewport.svelte';
	import { setTimelineContext } from './context/timeline-context';
	import { TimelineContext } from './context/TimelineContext.svelte';

	setTimelineContext(new TimelineContext());
</script>

<InsertIntervalsDialog />
<Viewport />
