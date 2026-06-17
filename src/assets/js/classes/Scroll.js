import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { $scroll } from '@js/stores/scroll';

import Lenis from 'lenis';

// =============================================================================
// static を使うことで、インスタンス化せずにクラスメソッドを呼び出せるようにする
// これにより、Scrollクラスのメソッドを直接呼び出すことができる
// 例: Scroll.init() や Scroll.scrollTo(target, options) のように使用する
// =============================================================================
export class Scroll {
	// =============================================================================
	// ライフサイクル
	// =============================================================================
	static init() {
		this.lenis = new Lenis();

		this.lenis.on(
			'scroll',
			({ scroll, limit, velocity, direction, progress }) => {
				$scroll.set({
					scroll,
					limit,
					velocity,
					direction,
					progress,
				});

				ScrollTrigger.update();
			}
		);

		gsap.ticker.add((time) => {
			this.lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0);
	}

	static destroy() {
		this.lenis?.destroy();
	}

	// =============================================================================
	// メソッド
	// =============================================================================
	static start() {
		this.lenis?.start();
	}

	static stop() {
		this.lenis?.stop();
	}

	static scrollTo(target, options = {}) {
		this.lenis?.scrollTo(target, options);
	}
}
