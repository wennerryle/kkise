const generator = (function* id() {
	let i = 0;

	while (true) {
		yield (++i).toString();
	}
})();

export const numericId = () => generator.next().value;

function generateUUID() {
	const cryptoObj = window.crypto;

	if (!cryptoObj || !cryptoObj.getRandomValues) {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	// @ts-expect-error magic string convertion
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(c ^ (cryptoObj.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
	);
}

export const stringId = () => (crypto.randomUUID ? crypto.randomUUID() : generateUUID());
