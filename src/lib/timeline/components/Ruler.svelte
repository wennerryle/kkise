<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { formatTime } from '../logic/time';
	import { TimelineRulerController } from '../controllers/TimelineRulerController';
	import { getTimelineContext } from '../context/timeline-context';

	const timelineContext = getTimelineContext();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let container: HTMLElement;

	const slate50 = '#f8fafc';
	const slate400 = '#94a3b8';
	const slate500 = '#64748b';

	const theme = {
		bg: slate50,
		secondaryLine: slate400,
		mainLine: slate500,
		text: slate500,
		fontSize: 10,
		font: 'Inter, sans-serif',
		tickMain: 15,
		tickSub: 15
	};

	let isResized = false;

	function draw() {
		if (!ctx || !isResized) return;
		const dpr = window.devicePixelRatio || 1;

		const width = canvas.width;
		const height = canvas.height;

		ctx.fillStyle = theme.bg;
		ctx.fillRect(0, 0, width, height);

		ctx.lineWidth = 1 * dpr;
		ctx.fillStyle = theme.text;

		const fontSize = theme.fontSize * dpr;

		ctx.font = `${fontSize}px ${theme.font}`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';

		const viewport = timelineContext.viewport;

		const zoomLevel = viewport.pixelsPerSec;

		const visibleWidthCss = width / dpr;
		const startSeconds = Math.floor(viewport.scrollLeft / zoomLevel);
		const endSeconds = Math.ceil((viewport.scrollLeft + visibleWidthCss) / zoomLevel);

		let step = 1;
		if (zoomLevel < 15) step = 30;
		else if (zoomLevel < 30) step = 10;
		else if (zoomLevel < 60) step = 5;

		const totalDurationInSeconds = timelineContext.player.totalDuration / 1000;

		for (let i = startSeconds; i <= endSeconds; i++) {
			if (i < 0 || i > totalDurationInSeconds) continue;

			const xPx = (i * zoomLevel - viewport.scrollLeft) * dpr;

			if (i % step === 0) {
				ctx.strokeStyle = theme.mainLine;
				ctx.beginPath();
				ctx.moveTo(xPx, height);

				ctx.lineTo(xPx, theme.tickMain * dpr);
				ctx.stroke();

				const gap = 4;
				const yPx = (theme.tickMain - theme.fontSize - gap) * dpr;

				if (i === 0) {
					ctx.fillText(formatTime(i), xPx + 12 * dpr, yPx);
				} else {
					ctx.fillText(formatTime(i), xPx, yPx);
				}
			} else if (zoomLevel > 15) {
				ctx.strokeStyle = theme.secondaryLine;
				ctx.beginPath();
				ctx.moveTo(xPx, height);
				ctx.lineTo(xPx, theme.tickSub * dpr);
				ctx.stroke();
			}
		}
	}

	function handleResize() {
		if (!container || !canvas) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = container.getBoundingClientRect();

		timelineContext.viewport.width = rect.width;

		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.height}px`;
		isResized = true;

		draw();
	}

	onMount(() => {
		ctx = canvas.getContext('2d');

		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(container);

		onDestroy(() => {
			resizeObserver.disconnect();
		});
	});

	$effect(() => {
		/* eslint-disable @typescript-eslint/no-unused-expressions */
		timelineContext.viewport.pixelsPerMs;
		timelineContext.viewport.scrollLeft;
		timelineContext.player.totalDuration;
		/* eslint-enable @typescript-eslint/no-unused-expressions */

		if (ctx) {
			requestAnimationFrame(draw);
		}
	});

	const timelineController = new TimelineRulerController(timelineContext);
</script>

<div
	bind:this={container}
	style="--track-header-width: {timelineContext.viewport.trackHeaderWidth - 1}px"
	class={[
		'absolute right-0 h-full min-h-12 w-[calc(100%-var(--track-header-width))] cursor-e-resize overflow-hidden border-b border-l border-slate-200 select-none'
	]}
>
	<canvas bind:this={canvas} {...timelineController.handlers} class="absolute block"></canvas>
</div>
