import { atom } from 'nanostores';

/**
 * Component Manager のデバッグ設定
 * window.COMPONENT_MANAGER_DEBUG が true の場合に自動で有効化される
 */
const isDebugEnabled = () => {
	try {
		return (
			typeof window !== 'undefined' &&
			window.COMPONENT_MANAGER_DEBUG === true
		);
	} catch (e) {
		return false;
	}
};

/**
 * カスタム要素とそのライフサイクルを管理するストア
 */
export const $componentsManagerIncrement = atom(0);
export const $componentsManager = atom([]);

/**
 * getComponentsByPrototype の最適化用キャッシュ管理
 */
let prototypeCache = new Map();
let cacheStoreSnapshot = [];

/**
 * Component Manager のグローバルブリッジを初期化する
 * nanostores への依存なしで外部ライブラリからアクセス可能にする
 * 安全な読み取り専用操作のみを公開する
 */
const initializeWindowBridge = () => {
	if (typeof window !== 'undefined') {
		const componentManager = {
			getById: (id) => getComponentById(id),
			getByPrototype: (prototype) => getComponentsByPrototype(prototype),
			find: (predicate) => findComponents(predicate),
			getRegisteredPrototypes: () => getRegisteredPrototypes(),
			getComponentCount: () => getComponentCount(),
		};

		// 互換性向上のため Object.defineProperty で components getter を定義する
		Object.defineProperty(componentManager, 'components', {
			get: () => $componentsManager.get(),
			enumerable: true,
			configurable: false,
		});

		window.ComponentManager = componentManager;
	}
};

/**
 * 管理機能付きのカスタム要素を作成するクラス
 */
export const ComponentElement = (Base, className) => {
	return class extends Base {
		constructor(...args) {
			super(...args);
			this.prototypeType = className;

			if (!this.id) {
				const index = $componentsManagerIncrement.get() + 1;
				$componentsManagerIncrement.set(index);
				this.id = `${this.prototypeType.toLowerCase()}-${index}`;
			}

			if (isDebugEnabled()) {
				console.log(
					`🔧 ComponentManager: "${this.id}" (${this.prototypeType}) registered`
				);
			}
		}

		connectedCallback() {
			if (typeof Base.prototype.connectedCallback === 'function') {
				Base.prototype.connectedCallback.call(this);
			}
			$componentsManager.set([...$componentsManager.get(), this]);

			if (isDebugEnabled()) {
				console.log(
					`✅ ComponentManager: "${this.id}" connected to DOM`
				);
			}
		}

		disconnectedCallback() {
			if (typeof Base.prototype.disconnectedCallback === 'function') {
				Base.prototype.disconnectedCallback.call(this);
			}
			$componentsManager.set(
				$componentsManager
					.get()
					.filter(($component) => $component.id !== this.id)
			);

			if (isDebugEnabled()) {
				console.log(
					`❌ ComponentManager: "${this.id}" disconnected from DOM`
				);
			}
		}
	};
};

/**
 * 一意の ID からコンポーネントを取得する
 */
export const getComponentById = (id) => {
	return $componentsManager.get().find(($component) => $component.id === id);
};

/**
 * 特定の prototype のコンポーネントを取得する（除外フィルタあり）
 * 頻繁に呼ばれるクエリ向けにキャッシュで最適化する
 */
export const getComponentsByPrototype = (
	prototype,
	selectorsToExclude = []
) => {
	const currentStore = $componentsManager.get();

	// ストアが変わったらキャッシュを無効化
	if (currentStore !== cacheStoreSnapshot) {
		prototypeCache.clear();
		cacheStoreSnapshot = currentStore;
	}

	// 除外がない場合のみキャッシュする（最も多いケース）
	const hasExclusions = Array.isArray(selectorsToExclude)
		? selectorsToExclude.length > 0
		: selectorsToExclude !== '';

	if (!hasExclusions) {
		if (prototypeCache.has(prototype)) {
			return prototypeCache.get(prototype);
		}
	}

	// 除外セレクタを構築
	let excludedSelectors = [];

	if (typeof selectorsToExclude === 'string') {
		excludedSelectors = [selectorsToExclude];
	} else if (Array.isArray(selectorsToExclude)) {
		excludedSelectors = selectorsToExclude;
	} else if (
		selectorsToExclude instanceof HTMLElement &&
		selectorsToExclude.id
	) {
		excludedSelectors = [`#${selectorsToExclude.id}`];
	}

	// コンポーネントをフィルタ
	const result = currentStore.filter(($component) => {
		return (
			prototype === $component.prototypeType &&
			!excludedSelectors.some(
				(selector) => $component.matches && $component.matches(selector)
			)
		);
	});

	// 除外がない場合はキャッシュ
	if (!hasExclusions) {
		prototypeCache.set(prototype, result);
	}

	return result;
};

/**
 * カスタム述語関数でコンポーネントを検索する
 * @param predicate - 取り込むコンポーネントで true を返す関数
 * @returns 一致したコンポーネントの配列
 *
 * @example
 * // 特定属性を持つコンポーネントを検索
 * const activeComponents = findComponents($component => $component.hasAttribute('active'));
 *
 * // 任意条件で検索
 * const openDialogs = findComponents(comp =>
 *   comp.prototypeType === 'Dialog' && comp.hasAttribute('open')
 * );
 */
export const findComponents = (predicate) => {
	return $componentsManager.get().filter(predicate);
};

/**
 * 登録済みの prototype 種別を取得する
 * @returns 一意な prototype 名の配列
 */
export const getRegisteredPrototypes = () => {
	const prototypes = new Set(
		$componentsManager.get().map(($component) => $component.prototypeType)
	);
	return Array.from(prototypes);
};

/**
 * コンポーネント統計を取得する
 * @returns prototype ごとのカウントを持つオブジェクト
 */
export const getComponentStats = () => {
	const stats = {};

	$componentsManager.get().forEach(($component) => {
		const type = $component.prototypeType;
		stats[type] = (stats[type] || 0) + 1;
	});

	return stats;
};

/**
 * 管理中コンポーネントの総数を取得する
 */
export const getComponentCount = () => {
	return $componentsManager.get().length;
};

// すべての関数定義後にブリッジを初期化
initializeWindowBridge();
