<script lang="ts">
    import Ruler from './Ruler.svelte';
    import { MouseButtons } from '../core/constants';
	import { Viewport } from '../core/Viewport.svelte';

    let scrollLeft = $state(0);
    let container: HTMLDivElement;
	
	const viewport = new Viewport();

    function handleMouseMove({ movementX, buttons }: MouseEvent) {
        if (!(buttons & MouseButtons.Primary)) return;
        scrollLeft = Math.max(0, scrollLeft - movementX);
    }

    function handleWheel(event: WheelEvent) {
        event.preventDefault();

        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

		const oldZoom = viewport.zoomLevel;

        const timeAtMouse = (scrollLeft + mouseX) / oldZoom;

        const zoomSpeed = 0.05;
        const delta = -event.deltaY * zoomSpeed;
        const newZoom = Math.max(10, oldZoom + delta);
        
        viewport.zoomLevel =newZoom;

        scrollLeft = Math.max(0, (timeAtMouse * newZoom) - mouseX);
    }
</script>

<div
    bind:this={container}
    class="flex h-full w-full flex-col overflow-hidden select-none bg-slate-50"
    onwheel={handleWheel}
    onmousemove={handleMouseMove}
    role="presentation"
>
    <Ruler {viewport} bind:scrollLeft />
</div>