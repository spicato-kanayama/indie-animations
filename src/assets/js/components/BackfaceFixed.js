// 令和最新版モーダルを開いているときに背景を固定するJS
/*!
 * TAK backfaceFixed.js
 * https://gist.github.com/tak-dcxi/cd4faad26cba9a99ba2e654dcb9ababf
 *
 * @author: TAK @tak_dcxi https://twitter.com/tak_dcxi
 */
export const backfaceFixed = (fixed) => {
	const body = document.body;

	// html要素のwriting-modeを取得し、縦書きかどうかを判定
	const getIsVerticalWritingMode = () => {
		const writingMode = window.getComputedStyle(
			document.documentElement
		).writingMode;
		return writingMode.includes('vertical');
	};

	// スクロールバーの幅を計算
	let scrollbarWidth = window.innerWidth - body.clientWidth;

	if (getIsVerticalWritingMode()) {
		scrollbarWidth = window.innerHeight - body.clientHeight;
	}

	// 背景のガタツキを防止するため、padding-inline-endを設定
	body.style.paddingInlineEnd = fixed ? `${scrollbarWidth}px` : '';

	// スクロール位置を取得または設定
	let scroll = fixed
		? (document.scrollingElement?.scrollTop ?? 0)
		: parseInt(body.style.insetBlockStart || '0');

	if (getIsVerticalWritingMode()) {
		scroll = fixed
			? (document.scrollingElement?.scrollLeft ?? 0)
			: parseInt(body.style.insetBlockStart || '0');
	}

	const styles = {
		blockSize: '100dvb',
		insetInlineStart: '0',
		overflow: 'hidden scroll',
		position: 'fixed',
		insetBlockStart: getIsVerticalWritingMode()
			? `${scroll}px`
			: `${scroll * -1}px`,
		inlineSize: '100vi',
	};

	// BODYのスタイルを適用またはクリア
	Object.keys(styles).forEach(
		(key) => (body.style[key] = fixed ? styles[key] : '')
	);

	// !fixedならwindow.scrollTo()を使用してスクロール位置を元に戻す
	if (!fixed) {
		if (getIsVerticalWritingMode()) {
			window.scrollTo(scroll, 0); // 水平スクロール位置の修正
		} else {
			window.scrollTo(0, scroll * -1); // 垂直スクロール位置の修正
		}
	}
};

export default backfaceFixed;
