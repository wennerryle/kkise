<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { formatTime } from '../core/utils';
	import { TimelineRulerController } from '../core/TimelineRulerController';
	import { getViewportContext } from '../viewport-context';

	const viewport = getViewportContext();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let container: HTMLElement;
	let dpr = 1;

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
		tickMain: 25,
		tickSub: 35
	};

	let isResized = false;

	function draw() {
		if (!ctx || !isResized) return;

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

		const zl = viewport.zoomLevel;

		const visibleWidthCss = width / dpr;
		const startSec = Math.floor(viewport.scrollLeft / zl);
		const endSec = Math.ceil((viewport.scrollLeft + visibleWidthCss) / zl);

		let step = 1;
		if (zl < 15) step = 30;
		else if (zl < 30) step = 10;
		else if (zl < 60) step = 5;

		for (let i = startSec; i <= endSec; i++) {
			if (i < 0 || i > viewport.totalSeconds) continue;

			const xPx = (i * zl - viewport.scrollLeft) * dpr;

			if (i % step === 0) {
				ctx.strokeStyle = theme.mainLine;
				ctx.beginPath();
				ctx.moveTo(xPx, height);

				ctx.lineTo(xPx, theme.tickMain * dpr);
				ctx.stroke();

				const gap = 4;

				if (i === 0) {
					ctx.fillText(formatTime(i), xPx + 12, (theme.tickMain - fontSize - gap) * dpr);
				} else {
					ctx.fillText(formatTime(i), xPx, (theme.tickMain - fontSize - gap) * dpr);
				}
			} else if (zl > 15) {
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
		dpr = window.devicePixelRatio || 1;
		const rect = container.getBoundingClientRect();

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
		viewport.zoomLevel;
		viewport.scrollLeft;
		viewport.totalSeconds;

		if (ctx) {
			requestAnimationFrame(draw);
		}
	});

	const timelineController = new TimelineRulerController(viewport);
</script>

<div
	bind:this={container}
	style="--track-header-width: {viewport.trackWidth}px"
	class={[
		'absolute right-0 h-full min-h-12 w-[calc(100%-var(--track-header-width))] cursor-e-resize overflow-hidden border-b border-slate-200 select-none'
	]}
	{...timelineController.handlers}
>
	<canvas bind:this={canvas} class="absolute block"></canvas>
</div>
