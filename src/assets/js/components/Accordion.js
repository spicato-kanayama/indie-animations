/**
 * 参考HTML
	<div class="js-accordion">
		<button class="js-accordion-trigger" type="button">
			<span class="title">
				# title
			</span>
		</button>

		<div class="js-accordion-target">
			<div class="body">
				# contants
			</div>
		</div>
	</div>

Accordion({
	base: ".js-accordion",
	trigger: ".js-accordion-trigger",
	target: ".js-accordion-target",
});
 */

/**
 * @param {Object} Options
 * @param {String | NodeListOf<Element>} Options.base - アコーディオンの親要素を指定
 * @param {String | HTMLElement} Options.trigger - アコーディオンのトリガー要素を指定
 * @param {String | HTMLElement} Options.target - アコーディオンのターゲット要素を指定
 * @param {Boolean} [Options.option=false] - trueの場合、他のアコーディオンが開いているときに閉じる
 */

export default function Accordion({ base, trigger, target, option = false }) {
	const getEventType = window.ontouchstart ? 'touchstart' : 'click';
	const baseElement =
		typeof base === 'string' ? document.querySelectorAll(base) : base;

	if (baseElement.length === 0) {
		console.error(`${base}が見つかりませんでした`);
		return;
	}

	baseElement.forEach((el, index) => {
		const triggerElement =
			typeof trigger === 'string' ? el.querySelector(trigger) : trigger;
		const targetElement =
			typeof target === 'string' ? el.querySelector(target) : target;

		if (!triggerElement || !targetElement) {
			console.error(`${trigger}か${target}が見つかりませんでした`);
			return;
		}

		// 初期状態の設定
		targetElement.id = `accordion-target-${index}`;
		triggerElement.setAttribute(
			'aria-controls',
			`accordion-target-${index}`
		);

		if (el.classList.contains('is-open')) {
			const bodyHeight = targetElement.firstElementChild?.clientHeight;
			targetElement.setAttribute('style', `height: ${bodyHeight}px;`);
			targetElement.setAttribute('aria-hidden', 'false');
			triggerElement.setAttribute('aria-expanded', 'true');
			triggerElement.setAttribute('aria-label', '閉じる');
		} else {
			targetElement.setAttribute('style', 'height: 0px;');
			targetElement.setAttribute('aria-hidden', 'true');
			triggerElement.setAttribute('aria-expanded', 'false');
			triggerElement.setAttribute('aria-label', '開く');
		}

		triggerElement.addEventListener(getEventType, () => {
			if (!el.classList.contains('is-open')) {
				const bodyHeight =
					targetElement.firstElementChild?.clientHeight;
				targetElement.setAttribute('style', `height: ${bodyHeight}px;`);
				el.classList.add('is-open');
				triggerElement.setAttribute('aria-expanded', 'true');
				triggerElement.setAttribute('aria-label', '閉じる');

				if (option) {
					baseElement.forEach((otherEl) => {
						if (otherEl !== el) {
							otherEl.classList.remove('is-open');
							const otherTargetElement =
								typeof target === 'string'
									? otherEl.querySelector(target)
									: target;
							if (otherTargetElement) {
								otherTargetElement.setAttribute(
									'style',
									'height: 0px;'
								);
							}
						}
					});
				}

				return;
			}

			el.classList.remove('is-open');
			targetElement.setAttribute('style', 'height: 0px;');
			triggerElement.setAttribute('aria-expanded', 'false');
			triggerElement.setAttribute('aria-label', '開く');
		});

		const resizeObserver = new ResizeObserver(() => {
			if (el.classList.contains('is-open')) {
				const bodyHeight =
					targetElement.firstElementChild?.clientHeight;
				targetElement.setAttribute('style', `height: ${bodyHeight}px;`);
			}
		});
		resizeObserver.observe(targetElement);
	});
}
