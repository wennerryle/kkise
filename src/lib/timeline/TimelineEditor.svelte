<script lang="ts">
	import Dialogs from './components/dialogs/Dialogs.svelte';
	import Toolbar from './components/Toolbar.svelte';
	import Viewport from './components/Viewport.svelte';
	import { setTimelineContext } from './context/timeline-context';
	import { TimelineContext } from './context/TimelineContext.svelte';

	setTimelineContext(new TimelineContext());
</script>

<Dialogs />

<div class="bg-slate-50">
	<Toolbar />
	<Viewport />
</div>
