---
name: 'コンポーネント追加'
root: '.'
output: '.'
questions:
  folder:
    message: 'フォルダ名を選択してください'
    choices:
      - 'core'
      - 'parts'
  name: 'コンポーネント名を入力してください'
---

<!-- markdownlint-disable -->

# `src/components/{{ inputs.folder }}/{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.astro`

```astro
<div
	is="c-{{ inputs.name | kebab }}"
>
	<slot />
</div>

<style>
	@import './{{ inputs.name | pascal }}.scss';
</style>

<script>
	import('./{{ inputs.name | pascal }}.js');
</script>
```

# `src/components/{{ inputs.folder }}/{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.js`

```js
import { ComponentElement } from '@stores/componentManager';

export default class {{ inputs.name | pascal }} extends HTMLElement {
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

customElements.define(
	'c-{{ inputs.name | kebab }}',
	ComponentElement({{ inputs.name | pascal }}, 'c-{{ inputs.name | kebab }}'),
	{
		extends: 'div',
	}
);
```

# `src/components/{{ inputs.folder }}/{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.scss`

```scss
@use '@/assets/scss/foundation' as *;
