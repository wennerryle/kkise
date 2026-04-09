export const magicAttributes = Object.freeze({
	intervalId: 'data-interval-id',
	trackId: 'data-track-id',
	moveableX: 'data-moveable-x',
	resizableLeft: 'data-resizable-left',
	resizableRight: 'data-resizable-right'
});

export function lookupAttribute(element: HTMLElement, attribute: string, maxAttempts: number = 10) {
	let ref = element;

	for (let i = 0; i < maxAttempts; i++) {
		const value = ref.getAttribute(attribute);

		if (value !== null) {
			return value;
		}

		if (ref.parentElement !== null) {
			ref = ref.parentElement;
		} else {
			throw new Error('Reached top of the tree');
		}
	}

	return null;
}
