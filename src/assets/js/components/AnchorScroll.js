/**
 * @param {String} els - アンカーリンクの要素を取得
 * @param {Number} [num=0] - ギャップ量 デフォルトは0px
 * @param {Number} [duration=1000] - スクロール時間(ms) デフォルトは1000ms
 *
 * @example
 * AnchorScroll(".js-anchor-scroll", 65);
 */

export default function AnchorScroll(els, num = 0, duration = 1000) {
	const getEventType = window.ontouchstart ? 'touchstart' : 'click';
	const links = document.querySelectorAll(els);
	const gap = num;

	class ScrollAnimation {
		constructor({ duration }) {
			this.startPositionX = 0;
			this.startPositionY = 0;
			this.endPositionX = 0;
			this.endPositionY = 0;
			this.startTime = 0;
			this.animationId;
			this.duration = duration;
		}

		easeOutQuart(x) {
			return 1 - Math.pow(1 - x, 4);
		}

		animation() {
			const progress = Math.min(
				1,
				(Date.now() - this.startTime) / this.duration
			);
			const scrollValX =
				this.startPositionX +
				(this.endPositionX - this.startPositionX) *
					this.easeOutQuart(progress);
			const scrollValY =
				this.startPositionY +
				(this.endPositionY - this.startPositionY) *
					this.easeOutQuart(progress);
			window.scrollTo(scrollValX, scrollValY);
			if (progress < 1) {
				this.animationId = requestAnimationFrame(() => {
					this.animation();
				});
			}
		}

		exeScroll({ target }) {
			this.startPositionX = window.scrollX;
			this.startPositionY = window.scrollY;
			this.endPositionX = target.x != null ? target.x : window.scrollX;
			this.endPositionY = target.y != null ? target.y : window.scrollY;
			this.startTime = Date.now();
			this.animation();
		}
	}

	const SmoothScroll = new ScrollAnimation({ duration: duration });

	links.forEach((el) => {
		el.addEventListener(getEventType, () => {
			// ハッシュを残さない場合
			// event.preventDefault();

			const targetId =
				el.getAttribute('href') || el.getAttribute('data-href');
			let targetY;

			if (targetId === '#') {
				targetY = 0;
			} else if (typeof targetId === 'string') {
				const targetElement = document.querySelector(targetId);
				const documentHeight = document.body.clientHeight;

				if (targetElement) {
					const targetElementTop =
						targetElement.getBoundingClientRect().top;

					if (
						targetElementTop +
							window.pageYOffset +
							window.innerHeight >
						documentHeight
					) {
						targetY = documentHeight - window.innerHeight - gap;
					} else {
						targetY = targetElementTop + window.pageYOffset - gap;
					}
				} else {
					console.error(`${targetId}が見つかりませんでした。`);
				}
			}

			SmoothScroll.exeScroll({ target: { y: targetY } });
		});
	});
}
