---
name: '投稿追加'
root: '.'
output: '.'
questions:
  title: 'ページタイトルを入力してください'
  slug: 'slug名を入力してください'
---

<!-- markdownlint-disable -->

# `src/posts/{{ createdAtFormat }}-{{ inputs.slug }}.astro`

```astro
---
export const props = {
	slug: '{{ inputs.slug }}',
	title: '{{ inputs.title }}',
	createdAt: '{{ createdAt}}',
};
---

<c-{{ inputs.slug }} id="{{ inputs.slug }}" class="js-single">
	<h1 class="uVisuallyHidden">
		{{ inputs.title }}
	</h1>
</c-{{ inputs.slug }}>

<script>
	import { ComponentElement } from '/src/assets/js/stores/componentManager';

	let interval: any = null;

	class {{ inputs.slug | pascal }} extends HTMLElement {
		constructor() {
			super();
		}

		connectedCallback() {
			const singleClone = this.cloneNode(true);

			// 3秒ごとにクローンを挿入し、既存の要素を削除する
			interval = setInterval(() => {
				const parent = this.parentNode;

				this.remove();

				// firstSingle の後に singleClone を挿入する
				parent?.insertBefore(
					singleClone.cloneNode(true),
					this.nextSibling
				);
			}, 3000);
		}

		disconnectedCallback() {
			if (interval) {
				clearInterval(interval);
			}
		}
	}

	customElements.define('c-{{ inputs.slug }}', ComponentElement({{ inputs.slug | pascal }}, 'c-{{ inputs.slug }}'));
</script>

<style lang="scss" is:global>
	@use '/src/assets/scss/global' as *;
</style>
