import { debounce } from '../_utils/Utils';

export default function ViewportFixed() {
	const handleResize = () => {
		const minWidth = 375;
		const value =
			window.outerWidth > minWidth
				? 'width=device-width,initial-scale=1'
				: `width=${minWidth}`;
		const viewport = document.querySelector('meta[name="viewport"]');
		if (viewport && viewport.getAttribute('content') !== value) {
			viewport.setAttribute('content', value);
		}
	};

	const debouncedResize = debounce(handleResize, 250);

	window.addEventListener('resize', debouncedResize, false);
	handleResize();
}
