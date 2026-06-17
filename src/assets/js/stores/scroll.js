import { map } from 'nanostores';

export const $scroll = map({
	scroll: window.scrollY,
	limit: 0,
	velocity: 0,
	direction: 0,
	progress: 0,
});
