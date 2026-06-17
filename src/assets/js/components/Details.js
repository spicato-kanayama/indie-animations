/**
 * 参考HTML
	<details class="cAcc cAcc01 js-acc">
		<summary class="cAcc__head js-acc-head">
			<span class="cAcc__head_text">アコーディオンタイトル</span>

			<span class="cAcc__head_icon"></span>
		</summary>

		<div class="cAcc__body js-acc-body">
			<div class="cAcc__content">アコーディオンボディ</div>
		</div>
	</details>
 */

/**
 * 参考CSS
	@use '@spicato-inc/fortenv-style/module' as *;

	// display: list-item;以外を指定してデフォルトの三角形アイコンを消します
	summary {
		display: block;
	}

	// Safariで表示されるデフォルトの三角形アイコンを消します
	summary::-webkit-details-marker {
		display: none;
	}

	.cAcc {
		&__head {
			display: flex;
			justify-content: space-between;
			align-items: center;

			&_icon {
				--base: 1em;
				width: var(--base);
				height: var(--base);
				background-color: currentColor;
				clip-path: polygon(0 0, 100% 0%, 50% 100%);
			}
		}

		&__body {
			overflow: hidden;
		}

		&__content {
			padding: 10px 20px;
		}

		&[open] & {
			&__head {
				&_icon {
					transform: rotate(180deg);
				}
			}
		}
	}
 */

export default class Details {
	/**
	 * アニメーション内容は、[this.options], [this.closeAnim], [this.openAnim]を調整してください。
	 * @class
	 * @constructor
	 * @param {String | NodeListOf<HTMLDetailsElement>} details - detailsタグを指定（クラス名 or NodeListOf<HTMLDetailsElement>）
	 * @param {Object} Options
	 * @param {string} Options.head - summaryタグを指定（クラス名）
	 * @param {string} Options.body - 開閉部分を指定（クラス名）
	 * @param {Object} Options.animateOptions - アニメーションのオプション
	 *
	 * @example
	new Details('.js-acc', {
		head: '.js-acc-head',
		body: '.js-acc-body',
	});
	 **/
	constructor(
		details,
		{
			head,
			body,
			animateOptions = {
				duration: 400,
				easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
			},
		}
	) {
		/**
		 * @type {NodeListOf<HTMLDetailsElement>}
		 */
		this.details =
			typeof details === 'string'
				? document.querySelectorAll(details)
				: details;

		// details タグが見つからない場合
		if (this.details.length === 0) {
			console.error('No details');
			return;
		}

		this.head = head;
		this.body = body;
		this.animateOptions = animateOptions;

		// アニメーション
		this.options = {
			duration: this.animateOptions.duration,
			easing: this.animateOptions.easing,
		};

		this.closeAnim = (body) => [
			{
				height: `${body.offsetHeight}px`,
			},
			{
				height: 0,
			},
		];

		this.openAnim = (body) => [
			{
				height: 0,
			},
			{
				height: `${body.offsetHeight}px`,
			},
		];

		this._init();
	}

	/**
	 * @private
	 * @method
	 */
	_init() {
		this.details.forEach((details, i) => {
			// アニメーション管理用
			const flag = {};
			const id = i + 1;
			flag[id] = false;

			const head = details.querySelector(this.head);
			const body = details.querySelector(this.body);

			head.addEventListener('click', (e) => {
				e.preventDefault();
				// アニメーション中の場合はリターン
				if (flag[id]) return;

				if (details.open) {
					flag[id] = true;
					details.classList.remove('is-open');

					body.animate(
						this.closeAnim(body),
						this.options
					).finished.then(() => {
						details.removeAttribute('open');
						flag[id] = false;
					});
				} else {
					flag[id] = true;
					details.classList.add('is-open');

					details.setAttribute('open', 'true');
					body.animate(
						this.openAnim(body),
						this.options
					).finished.then(() => {
						flag[id] = false;
					});
				}
			});
		});
	}
}
