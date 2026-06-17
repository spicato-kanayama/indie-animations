// css
import '@splidejs/splide/css';
import './Slider.scss';

import { ComponentElement } from '@stores/componentManager';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Swiper
import Splide from '@splidejs/splide';

class SplideComponent {
	constructor() {
		this.splide = new Splide('.splide');
	}

	mount() {
		this.splide.mount();
	}

	destroy() {
		this.splide.destroy();
	}
}

export default class Slider extends HTMLElement {
	constructor() {
		super();

		this.splideComponent = new SplideComponent();
	}

	// =============================================================================
	// Lifecycle
	// =============================================================================
	connectedCallback() {
		this.bindEvents();
	}

	disconnectedCallback() {
		this.unbindEvents();
	}

	// =============================================================================
	// Events
	// =============================================================================
	bindEvents() {
		this.splideComponent.mount();
	}

	unbindEvents() {
		this.splideComponent.destroy();
	}

	// =============================================================================
	// Callbacks
	// =============================================================================

	// =============================================================================
	// Methods
	// =============================================================================
}

customElements.define(
	'c-about-slider',
	ComponentElement(Slider, 'c-about-slider'),
	{
		extends: 'section',
	}
);
