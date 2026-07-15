// libs

// 初期設定
function init() {
	requestAnimationFrame(() => {
		document.body.classList.remove('preload');
	});

	document.addEventListener('DOMContentLoaded', () => {
		// 日本時間の朝、昼、夕方、夜の時間帯に応じて、bodyにクラスを付与する
		// 朝 : 5:00 ~ 11:59
		// 昼 : 12:00 ~ 16:59
		// 夕方 : 17:00 ~ 19:59
		// 夜 : 20:00 ~ 4:59
		const now = new Date();
		const hour = now.getHours();

		if (hour >= 5 && hour < 12) {
			document.body.classList.add('is-morning');
		} else if (hour >= 12 && hour < 16) {
			document.body.classList.add('is-afternoon');
		} else if (hour >= 16 && hour < 20) {
			document.body.classList.add('is-evening');
		} else {
			document.body.classList.add('is-night');
		}
	});

	window.addEventListener('load', () => {});
}

// libsの読み込み
function loadLibs() {
	document.addEventListener('DOMContentLoaded', () => {});

	window.addEventListener('load', () => {});
}

export default function Foundation() {
	init();
	loadLibs();
}
