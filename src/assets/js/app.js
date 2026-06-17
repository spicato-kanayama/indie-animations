// css
import '@scss/style.scss';

// classes
import { Scroll } from './classes/Scroll';
import { Transitions } from './classes/Transitions';

// stores
import { $screenDebounce } from './stores/screen';

// utils
import Foundation from './utils/Foundation';

Foundation();

const transitions = new Transitions();
transitions.init();

Scroll.init();

$screenDebounce.subscribe(() => {
	let vw = document.documentElement.clientWidth;
	document.documentElement.style.setProperty('--vw', `${vw}px`);
});
