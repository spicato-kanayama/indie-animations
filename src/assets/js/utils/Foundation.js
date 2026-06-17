// 参照 : https://github.com/spicato-inc/fortenv-script

// import ViewportFixed from '@js/components/ViewportFixed';

// 初期設定
function init() {
	document.addEventListener('DOMContentLoaded', () => {});

	window.addEventListener('load', () => {});
}

// libsの読み込み
function loadLibs() {
	document.addEventListener('DOMContentLoaded', () => {
		// viewport固定（フルリキッドの場合はなし）
		// ViewportFixed();
	});

	window.addEventListener('load', () => {});
}

export default function Foundation() {
	init();
	loadLibs();
}
