---
name: 'ページ追加'
root: '.'
output: '.'
questions:
  title: 'ページタイトルを入力してください'
  slug: 'slug名を入力してください'
---

<!-- markdownlint-disable -->

# `src/pages/{{ inputs.slug }}.astro`

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';

const props = {
	title: '{{ inputs.title }}',
};
---

<BaseLayout {...props}>
	<h1 class="{{ inputs.slug }}">{{ inputs.slug }}</h1>
</BaseLayout>

<style lang="scss">
	@use '@/assets/scss/modules' as *;
</style>

```

# `src/assets/js/pages/{{ inputs.slug }}.ts`

```js
let eventController: AbortController;

const {{ inputs.slug | pascal }} = {
	init: () => {
		eventController = new AbortController();
		console.log('initialized: {{ inputs.slug | pascal }}');
	},

	destroy: () => {
		console.log('destroyed: {{ inputs.slug | pascal }}');
		eventController.abort();
	},
};

export default {{ inputs.slug | pascal }};
```
