// css
import './Hoge.scss';

import { ComponentElement } from '@stores/componentManager';

export default class Hoge extends HTMLElement {
	constructor() {
		super();
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

customElements.define('c-hoge', ComponentElement(Hoge, 'c-hoge'), {
	extends: 'div',
});
