/**
 * docs: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
 */
export enum MouseButtons {
	/** MouseButtons not pressed */
	None = 0,
	/** Left button (usually) */
	Primary = 1,
	/** Right button */
	Secondary = 2,
	/** Wheel (middle button) */
	Auxiliary = 4,
	/** Side button "back" */
	Fourth = 8,
	/** Side button "forward" */
	Fifth = 16
}
