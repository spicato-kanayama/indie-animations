// css
import './Button.scss';

import { $mouse } from '@js/stores/mouse';
import { ComponentElement } from '@stores/componentManager';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default class Button extends HTMLElement {
	constructor() {
		super();

		// Binding
		this.onClickBind = this.onClick.bind(this);

		// Data
		this.animation = null;
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
		this.addEventListener('click', this.onClickBind);
	}

	unbindEvents() {
		this.removeEventListener('click', this.onClickBind);
	}

	// =============================================================================
	// Callbacks
	// =============================================================================
	onClick() {
		const { x, y } = $mouse.value;
		console.log('Button clicked at:', x, y);
	}

	// =============================================================================
	// Methods
	// =============================================================================
	move() {
		gsap.to(this, {
			x: Math.random() * 200 - 100,
			y: Math.random() * 200 - 100,
			duration: 0.5,
			overwrite: 'auto',
			ease: 'power2.out',
		});
	}
}

customElements.define(
	'c-button',
	ComponentElement(Button, 'Button', {
		extends: 'button',
	})
);
