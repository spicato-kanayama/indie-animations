/**
 * @example 使用例
 *
	new Pointer();
	document.addEventListener('click', () => {
		console.log(Pointer.x);
	});
 */

let instance = null;

export default class Pointer {
	constructor() {
		// シングルトン
		if (instance) return instance;

		this.px = 0;
		this.py = 0;

		instance = this;
		this.init();
	}

	static getInstance() {
		if (!instance) {
			instance = new Pointer();
		}

		return instance;
	}

	static get x() {
		return this.getInstance().px;
	}

	static get y() {
		return this.getInstance().py;
	}

	init() {
		document.addEventListener('pointermove', this.onPointerMove.bind(this));
	}

	onPointerMove(e) {
		this.px = e.clientX;
		this.py = e.clientY;
	}
}
