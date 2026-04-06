export class Viewport {
	trackHeaderWidth = $state(300);
	width = $state(0);

	/** How much pixels taken by 1ms */
	#pixelsPerMs = $state(100 / 1000); /** 100px per second */

	get pixelsPerMs() {
		return this.#pixelsPerMs;
	}

	set pixelsPerMs(value) {
		this.#pixelsPerMs = Math.max(10 / 1000, value);
	}

	readonly pixelsPerSec = $derived(this.pixelsPerMs * 1000);

	/** How much scrolled by X-axis from left side in pixels */
	#scrollLeft = $state(0);

	get scrollLeft() {
		return this.#scrollLeft;
	}

	set scrollLeft(value: number) {
		this.#scrollLeft = Math.max(0, value);
	}
}
