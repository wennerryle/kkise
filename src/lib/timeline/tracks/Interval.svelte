<script lang="ts">
	import type { Interval } from '../repos/Repositories.svelte';
	import { getViewportContext } from '../viewport-context';

	interface Props {
		interval: Interval;
	}

	const { interval }: Props = $props();

	const viewport = getViewportContext();
</script>

<div
	class="absolute flex cursor-grab items-center justify-center bg-linear-to-t from-green-300 to-green-200 py-1 text-center"
	style="left: {interval.offset * viewport.zoomLevelMs - viewport.scrollLeft}px;
		   width: {interval.duration * viewport.zoomLevelMs}px"
>
	{interval.id}
</div>
