export function debounce(func, timeout = 300) {
	let timer;
	return (...args) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

export const getCssVar = (target, property) => {
	const value = getComputedStyle(target).getPropertyValue(property);

	if (typeof value === 'number') {
		return parseFloat(value);
	} else {
		return value;
	}
};
