export default class SplitText {
	/**
	 * @class SplitText
	 * @constructor
	 * @param {String} els - 対象要素（メイン）
	 * @param {Object} Options - オプション
	 * @param {any} [Options.target] - 対象要素（複数行の場合は行ごとに指定）
	 * @param {String} [Options.className] - 付与するクラス
	 * @param {Boolean|String} [Options.lines] - brごとに行でラップするか（文字列指定時は行ラップのクラス名）
	 * @param {Object} [Options.delay] - ベースになるディレイがある場合は指定（ms）
	 * @param {Number} [Options.delay.base] - ベースディレイ
	 * @param {Number} [Options.delay.time] - ディレイの時間
	 * @example
	   new SplitText(".js-s-block", {
	     target: ".js-s-text",
	     className: "-char",
	     delay: {
	      base: 100,
	      time: 100,
	     }
	   });
	 */

	constructor(
		els,
		{
			target = '',
			className = '-char',
			lines = false,
			delay = { base: 0, time: 0 },
		} = {}
	) {
		this.els = document.querySelectorAll(els);

		if (!this.els.length) {
			console.error(`SplitText: ${els} が見つかりませんでした。`);
			return;
		}

		this.className = className;
		this.lines = lines;
		this.linesClassName = typeof lines === 'string' ? lines : '-lines';
		this.delay = delay;

		// 対象要素が複数行の場合は、それぞれに対応する
		// テキストを分割する
		this.target = this.els;

		this.els.forEach((element) => {
			if (target !== '') {
				this.target = element.querySelectorAll(target);

				this.target.forEach((target) => {
					const innerHTML = target.innerHTML;
					const span = document.createElement('span');
					span.innerHTML = innerHTML;
					span.classList.add('uVisuallyHidden');
					target.insertAdjacentElement('afterbegin', span);
					target.innerHTML = this._split(innerHTML);
				});
			} else {
				const innerHTML = element.innerHTML;
				const span = document.createElement('span');
				span.innerHTML = innerHTML;
				span.classList.add('uVisuallyHidden');
				element.insertAdjacentElement('afterbegin', span);
				element.innerHTML = this._split(innerHTML);
			}
		});

		// ディレイを付与する
		if (this.delay.time > 0) {
			this._charsAddDelay();
		}
	}

	_split(text) {
		if (this.lines === false) {
			this.chars = text.trim().split('');
			return this._splitText();
		}

		const lines = text
			.trim()
			.split(/\s*<br\s*\/?\s*>\s*/gi)
			.map((line) => line.trim());

		const lineHtml = lines
			.map((line) => {
				this.chars = line.split('');
				return `<span class="-line">${this._splitText()}</span>`;
			})
			.join('<br/>');

		return `<span class="${this.linesClassName}">${lineHtml}</span>`;
	}

	_splitText() {
		return this.chars.reduce((acc, curr) => {
			if (curr === '＆') {
				curr = curr.replace('＆', '&amp;');
			} else if (curr.match(/\s+/)) {
				curr = curr.replace(/\s+/g, '&nbsp;');
			}

			return `${acc}<span class="${this.className}" aria-hidden="true">${curr}</span>`;
		}, '');
	}

	_charsAddDelay() {
		this.els.forEach((element) => {
			const chars = element.querySelectorAll(`.${this.className}`);
			const time = this.delay.time;
			const base = this.delay.base;

			chars.forEach((char, index) => {
				const transitionDelayTime = `${
					Math.round(time * index + base) / 1000
				}s, `;

				// css変数
				char.style.setProperty('--_char-delay', transitionDelayTime);
			});
		});
	}
}
