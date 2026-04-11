<script lang="ts">
	import { onMount } from 'svelte';
	import Dialogs from './components/dialogs/Dialogs.svelte';
	import Toolbar from './components/Toolbar.svelte';
	import Viewport from './components/Viewport.svelte';
	import { setTimelineContext } from './context/timeline-context';
	import { TimelineContext } from './context/TimelineContext.svelte';
	import { KeyboardHistoryController } from './controllers/keyboard-controllers/KeyboardHistoryController';

	const ctx = new TimelineContext();
	setTimelineContext(ctx);

	const keyboardController = new KeyboardHistoryController(ctx);

	onMount(() => () => keyboardController.destroy());
</script>

<Dialogs />

<div class="bg-slate-50 select-none">
	<Toolbar />
	<Viewport />
</div>
