import Tempus from 'tempus';
import { gsap } from 'gsap';

// utils
import { loop } from '@js/utils/tool';
import Ease from '@js/utils/Ease';

/**
 * @param {String | HTMLElement | Element} target
 * @param {Object} Options
 * @param {String} [Options.viewport='.carousel__viewport']
 * @param {String} [Options.slides='.carousel__slide']
 * @param {String} [Options.prev='.carousel__prev']
 * @param {String} [Options.next='.carousel__next']
 * @param {String} [Options.toggle='.carousel__toggle']
 * @param {Number || Boolean} [Options.autoPlay=3000] - 自動再生の間隔（ms）。falseの場合は自動再生なし
 * @returns {Carousel}
 */

export default class Carousel {
	constructor(
		target,
		{
			viewport = '.carousel__viewport',
			slides = '.carousel__slide',
			prev = '.carousel__prev',
			next = '.carousel__next',
			toggle = '.carousel__toggle',
			autoPlay = 3000,
		} = {}
	) {
		this._carousel =
			typeof target === 'string'
				? document.querySelector(target)
				: target;
		this._viewport = this._carousel.querySelector(viewport);
		this._slides = this._carousel.querySelectorAll(slides);
		this._prev = this._carousel.querySelector(prev);
		this._next = this._carousel.querySelector(next);
		this._toggle = this._carousel.querySelector(toggle);

		// 状態
		this._progress = 0;
		this._index = 0;
		this._isPlaying = false;

		// 自動再生
		this._interval = null;
		this._autoPlayInterval = autoPlay;

		// 自動再生の残り時間（ms）
		this._remainingTime = this._autoPlayInterval;

		// 次のスイッチ予定時刻（ms）
		this._nextSwitchAt = null;

		// ドラッグ関連
		this._isPointerDown = false; // ポインター押下中か
		this._pointerId = null; // 現在追跡しているポインターID
		this._dragStartX = 0; // ドラッグ開始時のX座標
		this._dragStartY = 0; // ドラッグ開始時のY座標
		this._dragCurrentX = 0; // 現在のX座標
		this._dragCurrentY = 0; // 現在のY座標
		this._dragOffsetX = 0; // 開始位置からのX移動量
		this._dragAxisLocked = false; // ドラッグ方向を確定済みか
		this._isHorizontalDrag = false; // 横方向ドラッグか
		this._shouldResumeAutoPlay = false; // ドラッグ後に自動再生を再開するか
		this._dragThresholdRatio = 0.4; // スワイプ判定しきい値（画面幅比）

		// サイズ
		this._viewportWidth = this._viewport.clientWidth;

		// リサイズチェック用オブジェクト
		this._resizeObject = {
			prevSize: { w: 0, h: 0 },
			checkTime: 0,
			interval: 500 * 0.01,
		};

		// イベント登録
		this._prev?.addEventListener('click', () => {
			if (this._isPlaying) return;

			this._switch(this._index - 1);

			if (this._interval) {
				this._autoPlay(this._autoPlayInterval, true);
			}
		});

		this._next?.addEventListener('click', () => {
			if (this._isPlaying) return;

			this._switch(this._index + 1);

			if (this._interval) {
				this._autoPlay(this._autoPlayInterval, true);
			}
		});

		this._toggle?.addEventListener('click', () => {
			const state = this._toggle.dataset.state;
			if (state === 'play') {
				this._carousel.dataset.state = 'pause';
				this._toggle.dataset.state = 'pause';
				this._toggle.setAttribute('aria-pressed', 'false');
				this._toggle.setAttribute('aria-label', '再生');
				this._pauseAutoPlay();
			} else {
				this._carousel.dataset.state = 'play';
				this._toggle.dataset.state = 'play';
				this._toggle.setAttribute('aria-pressed', 'true');
				this._toggle.setAttribute('aria-label', '停止');
				if (!this._interval) {
					this._autoPlay(this._autoPlayInterval);
				}
			}
		});

		this._viewport.addEventListener(
			'pointerdown',
			this._onPointerDown.bind(this)
		);
		this._viewport.addEventListener(
			'pointermove',
			this._onPointerMove.bind(this)
		);
		this._viewport.addEventListener(
			'pointerup',
			this._onPointerUp.bind(this)
		);
		this._viewport.addEventListener(
			'pointercancel',
			this._onPointerUp.bind(this)
		);

		this._switch(0);

		if (autoPlay) {
			this._autoPlay(this._autoPlayInterval, true);
			this._carousel.dataset.state = 'play';
		}

		Tempus.add(this._update.bind(this), {
			fps: 60,
		});
	}

	_resize() {
		this._viewportWidth = this._viewport.clientWidth;
	}

	_checkResize(time) {
		// 設定したinterval秒が経過している場合のみ処理を実行
		if (time - this._resizeObject.checkTime < this._resizeObject.interval) {
			return false;
		}

		this._resizeObject.checkTime = time;

		if (
			window.innerWidth !== this._resizeObject.prevSize.w ||
			window.innerHeight !== this._resizeObject.prevSize.h
		) {
			this._resizeObject.prevSize.w = window.innerWidth;
			this._resizeObject.prevSize.h = window.innerHeight;
			return true;
		}

		return false;
	}

	_switch(index) {
		this._index = index;

		const loopedIndex = loop(this._index, this._slides.length);
		this._carousel.dataset.index = loopedIndex + 1;

		this._slides.forEach((slide, i) => {
			if (i === loopedIndex) {
				slide.classList.remove('is-prev');
				slide.classList.add('is-active');
			} else if (i === loop(loopedIndex - 1, this._slides.length)) {
				slide.classList.add('is-prev');
				slide.classList.remove('is-active');
			} else {
				slide.classList.remove('is-active', 'is-prev');
			}
		});

		if (this._progressTween) {
			this._progressTween.kill();
		}

		this._isPlaying = true;
		this._carousel.dataset.playing = 'true';

		this._progressTween = gsap.to(this, {
			_progress: this._index,
			duration: 1,
			ease: Ease.SineInExpoOut,
			overwrite: 'auto',
			onComplete: () => {
				this._isPlaying = false;
				this._carousel.dataset.playing = 'false';
				this._progress = this._index;
			},
		});
	}

	_onPointerDown(event) {
		if (this._isPlaying) return;

		console.log(event.pointerType, event.button);

		this._isPointerDown = true;
		this._pointerId = event.pointerId;
		this._dragStartX = event.clientX;
		this._dragCurrentX = event.clientX;
		this._dragStartY = event.clientY;
		this._dragCurrentY = event.clientY;
		this._dragOffsetX = 0;
		this._dragAxisLocked = false;
		this._isHorizontalDrag = false;
		this._shouldResumeAutoPlay = Boolean(this._interval);

		if (this._shouldResumeAutoPlay) {
			this._pauseAutoPlay();
		}

		this._carousel.dataset.dragging = 'true';
		this._viewport.setPointerCapture(event.pointerId);
	}

	_onPointerMove(event) {
		if (!this._isPointerDown || event.pointerId !== this._pointerId) {
			return;
		}

		this._dragCurrentX = event.clientX;
		this._dragCurrentY = event.clientY;

		const deltaX = this._dragCurrentX - this._dragStartX;
		const deltaY = this._dragCurrentY - this._dragStartY;

		if (!this._dragAxisLocked) {
			const lockThreshold = 6;
			if (
				Math.abs(deltaX) > lockThreshold ||
				Math.abs(deltaY) > lockThreshold
			) {
				this._dragAxisLocked = true;
				this._isHorizontalDrag = Math.abs(deltaX) >= Math.abs(deltaY);
			}
		}

		if (!this._isHorizontalDrag) {
			return;
		}

		this._dragOffsetX = deltaX;

		event.preventDefault();
	}

	_onPointerUp(event) {
		if (!this._isPointerDown || event.pointerId !== this._pointerId) {
			return;
		}

		const dragDistance = this._dragOffsetX;
		const threshold = Math.max(
			40,
			this._viewportWidth * this._dragThresholdRatio
		);
		const isSwipe = this._isHorizontalDrag;
		const draggedProgress =
			this._index - dragDistance / Math.max(1, this._viewportWidth);

		this._isPointerDown = false;
		this._pointerId = null;
		this._dragAxisLocked = false;
		this._isHorizontalDrag = false;
		this._progress = draggedProgress;
		this._dragOffsetX = 0;
		this._carousel.dataset.dragging = 'false';

		if (this._viewport.hasPointerCapture(event.pointerId)) {
			this._viewport.releasePointerCapture(event.pointerId);
		}

		if (
			isSwipe &&
			Math.abs(dragDistance) >= threshold &&
			!this._isPlaying
		) {
			this._switch(this._index + (dragDistance < 0 ? 1 : -1));
		} else {
			this._snapBackToCurrent();
		}

		if (this._shouldResumeAutoPlay && this._isAutoPlayEnabled()) {
			this._autoPlay(this._autoPlayInterval, true);
		}

		this._shouldResumeAutoPlay = false;
	}

	_snapBackToCurrent() {
		if (this._progressTween) {
			this._progressTween.kill();
		}

		this._isPlaying = true;
		this._carousel.dataset.playing = 'true';

		this._progressTween = gsap.to(this, {
			_progress: this._index,
			duration: 0.6,
			ease: 'power3.out',
			overwrite: 'auto',
			onComplete: () => {
				this._isPlaying = false;
				this._carousel.dataset.playing = 'false';
				this._progress = this._index;
			},
		});
	}

	_isAutoPlayEnabled() {
		if (!this._toggle) return true;
		return this._toggle.dataset.state !== 'pause';
	}

	_autoPlay(interval = this._autoPlayInterval, reset = false) {
		if (this._interval) {
			clearTimeout(this._interval);
			this._interval = null;
		}

		if (reset) {
			this._remainingTime = interval;
		}

		const delay = Math.max(0, this._remainingTime ?? interval);
		this._nextSwitchAt = performance.now() + delay;

		this._interval = setTimeout(() => {
			this._switch(this._index + 1);
			this._remainingTime = interval;
			this._autoPlay(interval, true);
		}, delay);
	}

	_pauseAutoPlay() {
		if (!this._interval || this._nextSwitchAt === null) {
			return;
		}

		this._remainingTime = Math.max(
			0,
			this._nextSwitchAt - performance.now()
		);
		clearTimeout(this._interval);
		this._interval = null;
		this._nextSwitchAt = null;
	}

	_update() {
		if (this._checkResize(Tempus.clock.time)) {
			this._resize();
		}

		const total = this._slides.length;
		const currentProgress = loop(this._progress, total);
		const half = total / 2;

		this._slides.forEach((slide, i) => {
			const rawDiff = i - currentProgress;
			const diff = loop(rawDiff + half, total) - half;
			const x = diff * this._viewportWidth + this._dragOffsetX;
			const progressWithDrag = x / Math.max(1, this._viewportWidth);

			slide.style.setProperty('--_progress', progressWithDrag);
			slide.style.translate = `${x}px 0px`;
		});
	}
}
