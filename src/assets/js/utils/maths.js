const mapRange = (min, max, nmin, nmax, value) => {
	return ((value - min) / (max - min)) * (nmax - nmin) + nmin;
};

const clamp = (min, max, value) => {
	return Math.max(min, Math.min(value, max));
};

const normalize = (min, max, value) => {
	return clamp(0, 1, (value - min) / (max - min));
};

const roundToDecimals = (value, decimals) => {
	const factor = Math.pow(10, decimals);
	return Math.round((value + Number.EPSILON) * factor) / factor;
};

export { mapRange, clamp, normalize, roundToDecimals };
