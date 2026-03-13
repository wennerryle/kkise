export class Viewport {
    trackHeaderWidth = $state(300);

    /** Total duration in ms */
    totalDuration = $state(600 * 1000);

    /** How much pixels taken by 1ms */
    zoomLevelMs = $state(100 / 1000); /** 100px per second */
    zoomLevelSec = $derived(this.zoomLevelMs * 1000);

    /** How much scrolled by X-axis from left side in pixels */
    scrollLeft = $state(0);
}
