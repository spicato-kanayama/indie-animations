import { Scroll } from '../classes/Scroll';

/**
 * @param {Object} Option
 * @param {string} Option.modal - モーダルのクラス名
 * @param {string} Option.htmlClassName - htmlタグに付与するクラス名
 * @param {string} [Option.modalFocusArea] - モーダルを開いた時にフォーカスを追加で当てたいエリアのクラス名
 * @param {string} Option.inertArea - モーダルを開いた時にinert属性を付与するエリアのクラス名
 * @param {any} [Option.overlay] - ある場合はクラス名を指定
 *
 * @example
 	<div class="cModal">
		<div class="cModal__inner js-menu" aria-hidden="true">
			<div class="cModal__wrapper" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
				<span id="dialog-title" class="visuallyHidden">これはモーダルです</span>

				<div class="cModal__overlay js-modal-overlay"></div>

				<div class="cModal__content" role="document">#contents</div>
			</div>
		</div>
	</div>
 */
export class Modal {
	constructor({
		modal,
		htmlClassName = 'is-open',
		modalFocusArea = null,
		inertArea = null,
		overlay = '',
	}) {
		this.htmlClassName = htmlClassName;
		this.modal =
			modal instanceof HTMLElement
				? modal
				: document.querySelector(modal);
		this.inertAreaList = document.querySelectorAll(inertArea);
		this.overlay = overlay ? document.querySelectorAll(overlay) : [];
		this.modalFocusAreaArray = modalFocusArea
			? document.querySelectorAll(modalFocusArea)
			: [];

		if (!this.modal) {
			console.error('Modal.js: modal is not found');
			return;
		}

		// tabbableな要素は Micromodal.js を参考に実装
		// https://github.com/ghosh/Micromodal/blob/master/lib/src/index.js
		this.FOCUSABLE_ELEMENTS = [
			'a[href]',
			'area[href]',
			'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
			'select:not([disabled]):not([aria-hidden])',
			'textarea:not([disabled]):not([aria-hidden])',
			'button:not([disabled]):not([aria-hidden])',
			'iframe',
			'object',
			'embed',
			'[contenteditable]',
			'[tabindex]:not([tabindex^="-"])',
		];

		// this.modalLinkArray と this.modalFocusAreaArray の要素を結合
		this.modalLinkArray = this.modal.querySelectorAll(
			this.FOCUSABLE_ELEMENTS.join(',')
		);

		this.totalModalLinkArray = [
			...this.modalFocusAreaArray,
			...this.modalLinkArray,
		];

		this.focusLinkArray = Array.from(this.inertAreaList).flatMap(
			(inertAreaItem) =>
				Array.from(
					inertAreaItem.querySelectorAll(
						this.FOCUSABLE_ELEMENTS.join(',')
					)
				)
		);

		this.firstFocusable = this.totalModalLinkArray[0];
		this.lastFocusable =
			this.totalModalLinkArray[this.totalModalLinkArray.length - 1];

		// flag
		this.isModalOpen = false;
	}

	init() {
		this.modalLinkArray?.forEach((el) => {
			el.setAttribute('tabindex', '-1');
		});

		this.modal.setAttribute('inert', '');
	}

	handleKeyDown = (e) => {
		if (e.key === 'Tab') {
			e.preventDefault();

			const focusedItemIndex = this.totalModalLinkArray.indexOf(
				document.activeElement
			);

			if (e.shiftKey) {
				if (focusedItemIndex === 0) {
					this.totalModalLinkArray[
						this.totalModalLinkArray.length - 1
					].focus();
				} else {
					this.totalModalLinkArray[focusedItemIndex - 1].focus();
				}
			} else {
				if (focusedItemIndex === this.totalModalLinkArray.length - 1) {
					this.totalModalLinkArray[0].focus();
				} else {
					this.totalModalLinkArray[focusedItemIndex + 1].focus();
				}
			}
		}
	};

	openModal() {
		// 背景固定
		Scroll.stop();

		document.documentElement.classList.add(this.htmlClassName);
		document.documentElement.classList.add('is-scroll-lock');

		this.modal.classList.add('is-open');
		this.modal.setAttribute('aria-hidden', 'false');
		this.modal.removeAttribute('inert');

		this.inertAreaList.forEach((inertAreaItem) => {
			inertAreaItem.setAttribute('aria-hidden', 'true');
		});
		this.inertAreaList.forEach((inertAreaItem) => {
			inertAreaItem.setAttribute('inert', '');
		});

		this.focusLinkArray.forEach((el) => {
			el.setAttribute('tabindex', '-1');
		});

		this.modalLinkArray.forEach((el) => {
			el.removeAttribute('tabindex');
		});

		this.isModalOpen = true;
	}

	closeModal() {
		// 背景固定解除
		Scroll.start();

		document.documentElement.classList.remove(this.htmlClassName);
		document.documentElement.classList.remove('is-scroll-lock');

		this.modal.classList.remove('is-open');
		this.modal.setAttribute('aria-hidden', 'true');
		this.modal.setAttribute('inert', '');

		this.inertAreaList.forEach((inertAreaItem) => {
			inertAreaItem.removeAttribute('aria-hidden');
		});
		this.inertAreaList.forEach((inertAreaItem) => {
			inertAreaItem.removeAttribute('inert');
		});

		this.focusLinkArray.forEach((el) => {
			el.removeAttribute('tabindex');
		});

		this.modalLinkArray.forEach((el) => {
			el.setAttribute('tabindex', '-1');
		});

		this.isModalOpen = false;
	}
}
