import { map } from 'nanostores';
import { $screen } from '@stores/screen';
import { normalize, roundToDecimals } from '@utils/maths';

const HALF_SCREEN_WIDTH = $screen.value.width * 0.5;
const HALF_SCREEN_HEIGHT = $screen.value.height * 0.5;

export const $mouse = map({
	x: HALF_SCREEN_WIDTH,
	y: HALF_SCREEN_HEIGHT,
	normalizedX: 0,
	normalizedY: 0,
});

export const $smoothMouse = map({
	smoothX: HALF_SCREEN_WIDTH,
	smoothY: HALF_SCREEN_HEIGHT,
	smoothNormalizedX: 0,
	smoothNormalizedY: 0,
	lerp: 0.08,
});

let isPlaying = false;
let RAF = null;

const onMouseMove = (event) => {
	const { clientX, clientY } = event;

	$mouse.setKey('x', clientX);
	$mouse.setKey('y', clientY);
	$mouse.setKey('normalizedX', normalize(0, $screen.value.width, clientX));
	$mouse.setKey('normalizedY', normalize(0, $screen.value.height, clientY));

	play();
};

const onUpdate = () => {
	const { x, y } = $mouse.value;
	const { smoothX, smoothY, lerp } = $smoothMouse.value;

	const updatedSmoothX = smoothX + (x - smoothX) * lerp;
	const updatedSmoothY = smoothY + (y - smoothY) * lerp;

	const roundedSmoothX = updatedSmoothX;
	const roundedSmoothY = updatedSmoothY;
	const roundedSmoothNormalizedX = normalize(
		0,
		$screen.value.width,
		updatedSmoothX
	);
	const roundedSmoothNormalizedY = normalize(
		0,
		$screen.value.height,
		updatedSmoothY
	);

	if (hasMouseStopped(roundedSmoothX, roundedSmoothY) && isPlaying) {
		return pause();
	}

	$smoothMouse.setKey('smoothX', roundToDecimals(roundedSmoothX, 3));
	$smoothMouse.setKey('smoothY', roundToDecimals(roundedSmoothY, 3));
	$smoothMouse.setKey(
		'smoothNormalizedX',
		roundToDecimals(roundedSmoothNormalizedX, 6)
	);
	$smoothMouse.setKey(
		'smoothNormalizedY',
		roundToDecimals(roundedSmoothNormalizedY, 6)
	);

	RAF = requestAnimationFrame(onUpdate);
};

const play = () => {
	if (isPlaying || RAF) return;
	// Use GSAP ticker instead of RAF
	// gsap.ticker.add(onUpdate);
	onUpdate();
	isPlaying = true;
};

const pause = () => {
	if (!isPlaying || !RAF) return;
	// Use GSAP ticker instead of RAF
	// gsap.ticker.remove(onUpdate);
	cancelAnimationFrame(RAF);
	RAF = null;
	isPlaying = false;
};

const hasMouseStopped = (smoothX, smoothY) => {
	return (
		smoothX + smoothY ===
		$smoothMouse.value.smoothX + $smoothMouse.value.smoothY
	);
};

/* Events */
window.addEventListener('mousemove', onMouseMove);
