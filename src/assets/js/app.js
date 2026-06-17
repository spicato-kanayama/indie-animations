// css
import '@scss/style.scss';

import Foundation from './utils/Foundation';
Foundation();

import { Scroll } from './classes/Scroll';
import { Transitions } from './classes/Transitions';

const transitions = new Transitions();
transitions.init();

Scroll.init();
