<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { formatTime } from '../core/utils'; // Функция 00:00
	import { Viewport } from '../core/Viewport.svelte';

	// Пропсы для синхронизации со скроллом
	interface Props {
		scrollLeft?: number;
		totalSeconds?: number;
		viewport: Viewport;
	}

	let { scrollLeft = $bindable(0), totalSeconds = $bindable(600), viewport }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let container: Element;
	let dpr = 1;
	
	const slate50 = '#f8fafc';
	const slate400 = '#94a3b8';
	const slate500 = '#64748b';

	// Настройки стиля (можно вынести в constants.js)
	const theme = {
		bg: slate50,
		secondaryLine: slate400,
		mainLine: slate500,
		text: slate500,
		font: '10px Inter, sans-serif',
		tickMain: 25,
		tickSub: 35
	};

	// Функция перерисовки
	function draw() {
		if (!ctx) return;

		const width = canvas.width;
		const height = canvas.height;

		// 1. Очистка холста
		ctx.fillStyle = theme.bg;
		ctx.fillRect(0, 0, width, height);

		// Подготовка стилей
		ctx.lineWidth = 1 * dpr;
		ctx.fillStyle = theme.text;

		const fontSize = 10 * dpr;

		ctx.font = `${fontSize}px Inter, sans-serif`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';

		// 2. Логика отрисовки меток
		const zl = viewport.zoomLevel;

		// Вычисляем, какие секунды сейчас видны на экране
		// (Ширина канваса в CSS пикселях)
		const visibleWidthCss = width / dpr;
		const startSec = Math.floor(scrollLeft / zl);
		const endSec = Math.ceil((scrollLeft + visibleWidthCss) / zl);

		// Определяем шаг отрисовки цифр (динамический зум)
		let step = 1;
		if (zl < 15) step = 30;
		else if (zl < 30) step = 10;
		else if (zl < 60) step = 5;

		// Цикл отрисовки только видимых элементов
		for (let i = startSec; i <= endSec; i++) {
			if (i < 0 || i > totalSeconds) continue;

			// Позиция на холсте (с учетом скролла)
			const xPx = (i * zl - scrollLeft) * dpr;

			if (i % step === 0) {
				// Основная метка
				ctx.strokeStyle = theme.mainLine;
				ctx.beginPath();
				ctx.moveTo(xPx, height);


				ctx.lineTo(xPx, theme.tickMain * dpr);
				ctx.stroke();

				const gap = 4;

				// Текст времени
				ctx.fillText(formatTime(i), xPx, (theme.tickMain - fontSize - gap) * dpr);
			} else if (zl > 15) {
				ctx.strokeStyle = theme.secondaryLine;
				ctx.beginPath();
				ctx.moveTo(xPx, height);
				ctx.lineTo(xPx, theme.tickSub * dpr);
				ctx.stroke();
			}
		}

		console.log("redraw");
	}

	// Обработка изменения размера окна
	function handleResize() {
		if (!container || !canvas) return;
		dpr = window.devicePixelRatio || 1;
		const rect = container.getBoundingClientRect();

		// Устанавливаем внутреннее разрешение холста с учетом DPR
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		// Масштабируем CSS размер обратно
		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.height}px`;

		draw();
	}

	// Жизненный цикл
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
		scrollLeft;
		totalSeconds;

		if (ctx) {
			requestAnimationFrame(draw);
		}
	});
</script>

<div
	bind:this={container}
	class={[
		'relative h-full min-h-32 w-full overflow-hidden border-b border-slate-200 select-none cursor-e-resize',
	]}
>
	<canvas
		bind:this={canvas}
		class="absolute inset-0 block"
	></canvas>
</div>
