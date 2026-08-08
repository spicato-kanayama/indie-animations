import gsap from 'gsap';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScriptsPlugin from '@swup/scripts-plugin';
import SwupJsPlugin from '@swup/js-plugin';
import Swup from 'swup';
import { Scroll } from './Scroll';
import Ease from '../utils/Ease';

const toDash = (str) => {
	return str
		.split(/(?=[A-Z])/)
		.join('-')
		.toLowerCase();
};

export class Transitions {
	static PRELOAD = 'preload';
	static READY_CLASS = 'is-ready';
	static BUSY_CLASS = 'is-busy';

	constructor() {
		this.onVisitStartBind = this.onVisitStart.bind(this);
		this.beforeContentReplaceBind = this.beforeContentReplace.bind(this);
		this.onContentReplaceBind = this.onContentReplace.bind(this);
		this.onAnimationInEndBind = this.onAnimationInEnd.bind(this);
		this.onAnimationOutStartBind = this.onAnimationOutStart.bind(this);
	}

	// =============================================================================
	// ライフサイクル
	// =============================================================================
	init() {
		this.initSwup();

		requestAnimationFrame(() => {
			document.body.classList.remove(Transitions.PRELOAD);
			document.documentElement.classList.add(Transitions.READY_CLASS);
		});
	}

	destroy() {
		this.swup?.destroy();
	}

	// =============================================================================
	// メソッド
	// =============================================================================
	initSwup() {
		this.swup = new Swup({
			plugins: [
				new SwupHeadPlugin({
					// style.scss など Vite 注入 CSS は SSR HTML に無いため persist 必須。
					// 増殖は dedupeViteDevStyles で抑える。
					persistAssets: true,
					awaitAssets: true,
				}),
				new SwupPreloadPlugin({
					preloadHoveredLinks: true,
					preloadInitialPage: !import.meta.env.DEV,
				}),
				new SwupScriptsPlugin(),
				new SwupJsPlugin({
					animations: [
						{
							from: '(.*)',
							to: '(.*)',
							out: async () => {
								await gsap.to('#swup', {
									filter: 'blur(10px)',
									duration: 0.32,
									ease: Ease.DoubleExpoInOut,
								});
							},
							in: async () => {
								await gsap.fromTo(
									'#swup',
									{
										filter: 'blur(10px)',
									},
									{
										filter: 'blur(0px)',
										duration: 0.64,
										ease: Ease.DoubleExpoInOut,
									}
								);
							},
						},
					],
				}),
			],
		});

		this.swup.hooks.on('visit:start', this.onVisitStartBind);
		this.swup.hooks.before(
			'content:replace',
			this.beforeContentReplaceBind
		);
		this.swup.hooks.on('content:replace', this.onContentReplaceBind);
		this.swup.hooks.on('animation:in:end', this.onAnimationInEndBind);
		this.swup.hooks.on('animation:out:start', this.onAnimationOutStartBind);

		this.swup.hooks.on('fetch:error', (e) => {
			console.log('fetch:error:', e);
		});
		this.swup.hooks.on('fetch:timeout', (e) => {
			console.log('fetch:timeout:', e);
		});
	}

	/**
	 * 次のコンテナのHTML datasetを取得し、実際のHTML要素のデータセットを更新する
	 *
	 * @param visit: VisitType
	 */
	updateDocumentAttributes(visit) {
		if (visit.fragmentVisit) return;

		const parser = new DOMParser();
		const nextDOM = parser.parseFromString(visit.to.html, 'text/html');
		const newDataset = {
			...nextDOM.querySelector('html')?.dataset,
		};

		Object.entries(newDataset).forEach(([key, val]) => {
			document.documentElement.setAttribute(
				`data-${toDash(key)}`,
				val ?? ''
			);
		});
	}

	/**
	 * Vite 開発時の style[data-vite-dev-id] を ID 単位で1つに保つ
	 */
	dedupeViteDevStyles() {
		const seen = new Map();

		document.querySelectorAll('style[data-vite-dev-id]').forEach((el) => {
			const id = el.getAttribute('data-vite-dev-id');
			if (!id) return;

			const prev = seen.get(id);
			if (prev) prev.remove();
			seen.set(id, el);
		});
	}

	// =============================================================================
	// フック
	// =============================================================================

	/**
	 * visit:startで発火
	 * 新しいページへの遷移が始まる
	 *
	 * @see https://swup.js.org/hooks/#visit-start
	 * @param visit: VisitType
	 */
	onVisitStart() {
		document.documentElement.classList.add(Transitions.BUSY_CLASS);
		document.documentElement.classList.remove(Transitions.READY_CLASS);
	}

	/**
	 * before:content:replaceで発火
	 * ページの古いコンテンツが新しいコンテンツに置き換えられる前
	 *
	 * @see https://swup.js.org/hooks/#content-replace
	 * @param visit: VisitType
	 */
	beforeContentReplace() {
		Scroll?.destroy();
	}

	/**
	 * content:replaceで発火
	 * ページの古いコンテンツが新しいコンテンツに置き換えられた時
	 *
	 * @see https://swup.js.org/hooks/#content-replace
	 * @param visit: VisitType
	 */
	onContentReplace(visit) {
		Scroll?.init();
		this.updateDocumentAttributes(visit);
		this.dedupeViteDevStyles();
	}

	/**
	 * animation:out:startで発火
	 * 現在のコンテンツがアニメーションで消え始める。クラス「.is-animating」が追加される
	 *
	 * @see https://swup.js.org/hooks/#animation-out-start
	 * @param visit: VisitType
	 */
	onAnimationOutStart() {}

	/**
	 * animation:in:endで発火
	 * 新しいコンテンツのアニメーションが終了する
	 *
	 * @see https://swup.js.org/hooks/#animation-in-end
	 * @param visit: VisitType
	 */
	onAnimationInEnd() {
		document.documentElement.classList.remove(Transitions.BUSY_CLASS);
		document.documentElement.classList.add(Transitions.READY_CLASS);
	}
}
