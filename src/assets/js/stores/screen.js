import { map } from 'nanostores';
import { debounce } from '@js/utils/tool';

export const $screen = map({
	width: window.innerWidth,
	height: window.innerHeight,
});

export const $screenDebounce = map({
	width: window.innerWidth,
	height: window.innerHeight,
});

window.addEventListener('resize', () => {
	const width = window.innerWidth;
	const height = window.innerHeight;

	$screen.set({ width, height });
});

const debouncedFunction = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;

	$screenDebounce.set({ width, height });
};
window.addEventListener('resize', debounce(debouncedFunction, 200));
