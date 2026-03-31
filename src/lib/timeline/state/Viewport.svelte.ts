export class Viewport {
	trackHeaderWidth = $state(300);
	width = $state(0);

	/** How much pixels taken by 1ms */
	zoomLevelMs = $state(100 / 1000); /** 100px per second */
	zoomLevelSec = $derived(this.zoomLevelMs * 1000);

	/** How much scrolled by X-axis from left side in pixels */
	#scrollLeft = $state(0);

	get scrollLeft() {
		return this.#scrollLeft;
	}

	set scrollLeft(value: number) {
		this.#scrollLeft = Math.max(0, value);
	}
}
