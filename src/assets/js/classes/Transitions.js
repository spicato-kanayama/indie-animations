import gsap from 'gsap';
// import SwupGaPlugin from '@swup/ga-plugin';
// import SwupGtmPlugin from '@swup/gtm-plugin';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScriptsPlugin from '@swup/scripts-plugin';
import SwupJsPlugin from '@swup/js-plugin';
import Swup from 'swup';
import { Scroll } from './Scroll';

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
		this.onPageViewBind = this.onPageView.bind(this);
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
				// new SwupGaPlugin(),
				// new SwupGtmPlugin(),
				new SwupHeadPlugin({
					persistAssets: true,
					awaitAssets: true,
				}),
				new SwupPreloadPlugin({
					preloadHoveredLinks: true,
					// @ts-ignore
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
									opacity: 0,
									duration: 0.25,
								});
							},
							in: async () => {
								await gsap.fromTo(
									'#swup',
									{ opacity: 0 },
									{ opacity: 1, duration: 0.25 }
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
		this.swup.hooks.on('page:view', this.onPageViewBind);
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

	/**
	 * page:viewで発火
	 * コンテンツの置換後、新しいコンテンツが表示されたタイミング
	 *
	 * @see https://swup.js.org/hooks/#page-view
	 * @param visit: VisitType
	 */
	onPageView() {
		// On sites using gtag.js
		// window.gtag('config', GA_MEASUREMENT_ID, {
		//   page_title: document.title,
		//   page_path: window.location.pathname + window.location.search
		// });
		//
		// Google Tag Manager
		// window.dataLayer.push({
		// 	event: 'VirtualPageview',
		// 	virtualPageURL: window.location.pathname + window.location.search,
		// 	virtualPageTitle: document.title,
		// });
	}
}
