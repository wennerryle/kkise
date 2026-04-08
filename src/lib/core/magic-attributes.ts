const _magicAttributes = Object.freeze({
	intervalId: 'data-interval-id',
	trackId: 'data-track-id',
	moveableX: 'data-moveable-x',
	resizableLeft: 'data-resizable-left',
	resizableRight: 'data-resizable-right'
});

export const magicAttributes = new Proxy(_magicAttributes, {
	// Ловушка для чтения свойств
	get(target, prop, receiver) {
		const value = Reflect.get(target, prop, receiver);

		if (typeof prop === 'string') {
			if (prop in target) {
				console.log(
					`%c[MagicAttributes] Accessing: ${prop} -> "${value}"`,
					'color: #4CAF50; font-weight: bold;'
				);
			} else {
				console.warn(
					`%c[MagicAttributes] Warning: Property "${prop}" does not exist!`,
					'color: #FF5722; font-weight: bold;'
				);
			}
		}

		return value;
	},

	// Ловушка для защиты от записи (так как объект заморожен)
	set(target, prop, value) {
		console.error(
			`%c[MagicAttributes] Error: Attempt to set "${String(prop)}" to "${value}". Object is immutable!`,
			'color: #f44336;'
		);
		return false; // Запрещает запись
	},

	// Ловушка для удаления свойств
	deleteProperty(target, prop) {
		console.error(
			`%c[MagicAttributes] Error: Attempt to delete "${String(prop)}"!`,
			'color: #f44336;'
		);
		return false;
	}
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
