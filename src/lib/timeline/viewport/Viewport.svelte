<script lang="ts">
	import Ruler from './Ruler.svelte';
	import { MouseButtons } from '../core/constants';
	import { Viewport } from '../core/Viewport.svelte';
	import TrackList from '../tracks/TrackList.svelte';

	let container: HTMLDivElement;

	const viewport = new Viewport();

	let isLeftMouseButtonPressed = false;

	function handleMouseMove({ movementX, buttons }: MouseEvent) {
		if (!(buttons & MouseButtons.Primary)) isLeftMouseButtonPressed = false;
		if (!isLeftMouseButtonPressed) return;
		viewport.scrollLeft = Math.max(0, viewport.scrollLeft - movementX);
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();

		const rect = container.getBoundingClientRect();
		const TRACK_HEADER_WIDTH = 144;
		const mouseX = event.clientX - rect.left - TRACK_HEADER_WIDTH;
		const oldZoom = viewport.zoomLevel;
		const timeAtMouse = (viewport.scrollLeft + mouseX) / oldZoom;
		const zoomSpeed = 0.05;
		const delta = -event.deltaY * zoomSpeed;
		const newZoom = Math.max(10, oldZoom + delta);

		viewport.zoomLevel = newZoom;

		viewport.scrollLeft = Math.max(0, timeAtMouse * newZoom - mouseX);
	}
</script>

<div
	class="relative mx-auto flex h-full flex-col overflow-hidden bg-slate-50 select-none"
	bind:this={container}
>
	<div
		onwheel={handleWheel}
		onmousemove={handleMouseMove}
		onmousedown={() => (isLeftMouseButtonPressed = true)}
		onmouseup={() => (isLeftMouseButtonPressed = false)}
		role="presentation"
	>
		<Ruler {viewport} />
	</div>
	<TrackList />
</div>
