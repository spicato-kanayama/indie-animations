import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { $scroll } from '@js/stores/scroll';

import Lenis from 'lenis';

export class Scroll {
	static init() {
		this.lenis = new Lenis({
			lerp: 1,
			duration: 0.4,
			anchors: {
				offset: -40,
			},
		});

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
