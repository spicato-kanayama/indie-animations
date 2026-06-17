# 状態管理

原文はこちら : https://github.com/locomotivemtl/astro-boilerplate/blob/main/src/scripts/stores/README.md

## Screen

### $screen

| プロパティ | 型       | 説明                       |
| ---------- | -------- | -------------------------- |
| `width`    | `number` | 更新されたウィンドウの幅   |
| `height`   | `number` | 更新されたウィンドウの高さ |

```js
import { $screen } from './stores/screen';

$screen.listen(({ width, height }) => {
    console.log('Screen:', { width, height });
});
```

### $screenDebounce

これはデフォルトで200msのデバウンスを使用します

| プロパティ | 型       | 説明                       |
| ---------- | -------- | -------------------------- |
| `width`    | `number` | 更新されたウィンドウの幅   |
| `height`   | `number` | 更新されたウィンドウの高さ |

```js
import { $screenDebounce } from './stores/screen';

$screenDebounce.listen(({ width, height }) => {
    console.log('Screen Debounce:', { width, height });
});
```

## Mouse

### $mouse

| プロパティ     | 型       | 説明                                                   |
| -------------- | -------- | ------------------------------------------------------ |
| `x`            | `number` | ウィンドウ上のカーソルのx座標位置（ピクセル単位）     |
| `y`            | `number` | ウィンドウ上のカーソルのy座標位置（ピクセル単位）     |
| `normalizedX`  | `number` | ウィンドウ上のカーソルのx座標位置（0から1の間）       |
| `normalizedY`  | `number` | ウィンドウ上のカーソルのy座標位置（0から1の間）       |

```js
import { $mouse } from './stores/mouse';

$mouse.listen(({ x, y, normalizedX, normalizedY }) => {
    console.log('Mouse:', { x, y, normalizedX, normalizedY });
});
```

### $smoothMouse

このスクリプトはデフォルトで0.8のlerp値を使用します。特筆すべきは、マウスの動きが検出されない場合、RAF（RequestAnimationFrame）が停止することです。GSAP（GreenSock Animation Platform）を使用している場合は、最適なパフォーマンスのためにカスタムRequestAnimationFrameの実装ではなく、gsap.tickerを使用することをお勧めします。

| プロパティ           | 型       | 説明                                                          |
| -------------------- | -------- | ------------------------------------------------------------- |
| `smoothX`            | `number` | ウィンドウ上のカーソルの補間されたx座標位置（ピクセル単位）  |
| `smoothY`            | `number` | ウィンドウ上のカーソルの補間されたy座標位置（ピクセル単位）  |
| `smoothNormalizedX`  | `number` | ウィンドウ上のカーソルの補間されたx座標位置（0から1の間）    |
| `smoothNormalizedY`  | `number` | ウィンドウ上のカーソルの補間されたy座標位置（0から1の間）    |
| `lerp`               | `number` | 補間値（デフォルトは.8）                                      |

```js
import { $smoothMouse } from './stores/mouse';

$smoothMouse.listen(
    ({ smoothX, smoothY, smoothNormalizedX, smoothNormalizedY }) => {
        console.log('SmoothMouse:', { smoothX, smoothY, smoothNormalizedX, smoothNormalizedY });
    }
);
```

## Scroll

### $scroll

Locomotive Scrollインスタンスからスクロール値にアクセスします。

| プロパティ   | 型       | 説明                                       |
| ------------ | -------- | ------------------------------------------ |
| `scroll`     | `number` | ウィンドウ上の現在のスクロール値（ピクセル単位） |
| `limit`      | `number` | スクロール可能な最大ピクセル               |
| `velocity`   | `number` | 現在のスクロール速度                       |
| `direction`  | `number` | 現在のスクロール方向（1/-1）               |
| `progress`   | `number` | 0から1の間の正規化されたスクロール進行状況 |

```js
import { $scroll } from './stores/scroll';

$scroll.listen(({ scroll, limit, velocity, direction, progress }) => {
    console.log('Scroll:', { scroll, limit, velocity, direction, progress });
});
```

## Device Status

### $mediaStatus

| プロパティ         | 型        | 説明                                                                                   |
| ------------------ | --------- | -------------------------------------------------------------------------------------- |
| `isReducedMotion`  | `boolean` | ユーザーが動きの少ない設定を有効にしている場合は`true`、それ以外は`false`を返します  |
| `isTouchScreen`    | `boolean` | タッチスクリーンのメディアクエリに一致する場合は`true`、それ以外は`false`を返します  |
| `isTouchOrSmall`   | `boolean` | タッチスクリーンまたは小さな画面のメディアクエリに一致する場合は`true`、それ以外は`false`を返します |

```js
import { subscribeKeys } from 'nanostores';
import { $mediaStatus } from '@scripts/stores/deviceStatus';

subscribeKeys($mediaStatus, ['isTouchOrSmall'], (value) => {
    console.log(value);
});
```

## 使用例

### コンポーネント内で

次の例では、イベントリスナーを変数に格納します。これは呼び出されたときにイベントのバインドを解除できる関数を返します。この手法は、イベントリスナーを管理し、必要に応じて効率的に削除する便利な方法を提供します。以下がその仕組みです：

```js
import { $screen } from './stores/screen';
import { $mouse } from './stores/mouse';

export default class Example {
    constructor() {
        this.onResize = this.onResize.bind(this)
        this.onMouseChange = this.onMouseChange.bind(this)
    }

    // =============================================================================
    // ライフサイクル
    // =============================================================================
    init() {
        this.bindEvents();
    }

    destroy() {
        this.unbindEvents();
    }

    // =============================================================================
    // イベント
    // =============================================================================
    bindEvents() {
        this.unbindScreenListener = $screen.listen(this.onResize);
        this.unbindMouseListener = $mouse.subscribe(this.onMouseChange);
    }

    unbindEvents() {
        this.unbindScreenListener?.();
        this.unbindMouseListener?.();
    }

    // =============================================================================
    // コールバック
    // =============================================================================
    onResize({ width, height }) {
        console.log('Screen:', { width, height });
    }

    onMouseChange({x, y, normalizedX, normalizedY}) {
        console.log('Mouse:', { x, y, normalizedX, normalizedY });
    }
}
```

> ⚠️ **警告**: ストアを操作する際、`Store#subscribe()`と`Store#listen(cb)`メソッドの違いを理解することが重要です。

- `Store#subscribe()`はコールバック関数をすぐに呼び出し、ストアの変更をサブスクライブします。サブスクリプション時にストアの現在の値をコールバックに渡します。
- 一方、`Store#listen(cb)`は次のストア変更時にのみコールバック関数をトリガーします。

アプリケーションで期待される動作を確保するために、この違いに注意し、要件に基づいて適切なメソッドを選択してください。

## Components Manager

`$componentsManager`は、カスタムWebコンポーネントインスタンスを**追跡および管理する**グローバルストアです。Webコンポーネントを動的に登録、アクセス、相互作用するための構造化された方法を提供します。

更新されたアーキテクチャでは、**ネイティブHTMLエレメントを拡張するすべてのカスタムコンポーネント**がコンポーネントマネージャーにシームレスに統合できるようになりました。

---

### ✨ 仕組み

Webコンポーネントが`ComponentElement`で強化されると：

- ✅ DOMに追加されたとき**自動的に**`$componentsManager`に**登録**されます。
- ✅ コンポーネントタイプに基づいた**一意のID**が割り当てられます（例：`accordion-1`、`dialog-2`）。
- ✅ DOMから削除されたとき**自動的に登録解除**されます。

これにより、Webコンポーネント間の**グローバルな追跡、取得、通信**が可能になります。

---

### 🚀 使用例

1. **`ComponentElement`を使用したカスタムコンポーネントの作成:**

    ```js
    import { ComponentElement } from '@root/src/scripts/stores/componentManager';

    class Foo extends HTMLElement {
        constructor() {
            super();
        }
    }

    customElements.define('c-foo', ComponentElement(Foo, 'Foo'));
    ```

    `HTMLElement`以外のクラスを拡張して、より具体的な属性と動作を取得することもできます。例えば、`HTMLDetailsElement`を拡張すると、ネイティブ機能を保持したカスタム`<details>`コンポーネントを作成できます。これは[is属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is)を使用して可能になり、カスタム要素が組み込み要素を拡張できるようになります。

    ```ts
    import { ComponentElement } from '@root/src/scripts/stores/componentManager';
    class Accordion extends HTMLDetailsElement {
        constructor() {
            super();
        }
    }

    customElements.define('c-accordion', ComponentElement(Accordion, 'Accordion'), {
        extends: 'details'
    });
    ```

    ```html
    <details is="c-accordion">
        <summary>クリックしてください</summary>
        <p>これはアコーディオンのコンテンツです！</p>
    </details>
    ```

2. **`$componentsManager`からコンポーネントインスタンスにアクセスする:**

    `$componentsManager.get()`または`getComponentsByPrototype()`や`getComponentsById()`などのヘルパーを使用して、現在のコンポーネントリストにアクセスし、操作できます。

    - **特定のプロトタイプのすべてのコンポーネントにアクセスする:**

    ```ts
    import { getComponentsByPrototype } from '@root/src/scripts/stores/componentManager';

    const $allFoo = getComponentsByPrototype('Foo'); // クラス名を文字列として使用
    $allFoo.forEach(($foo) => {
        $foo.doSomething(); // 各Fooインスタンスでメソッドを呼び出す
    });
    ```

    - **`id`で特定のコンポーネントにアクセスする:**

    ```html
    <c-foo id="foo-1"></c-foo>
    ```

    ```ts
    import { getComponentsById } from '@root/src/scripts/stores/componentManager';

    const $foo = getComponentsById('foo-1');
    if ($foo) {
        $foo.doSomething(); // 各Fooインスタンスでメソッドを呼び出す
    }
    ```

    - **現在のインスタンスを除外する:**

    ```ts
    import { getComponentsByPrototype } from '@root/src/scripts/stores/componentManager';

    // 2番目の引数として現在のインスタンスを渡すことで、それを除外する
    const $allFoo = getComponentsByPrototype('Foo', this);

    $allFoo.forEach(($foo) => {
        $foo.doSomething(); // 現在のインスタンスを除く各Fooインスタンスでメソッドを呼び出す
    });

    // セレクタ文字列またはセレクタの配列を渡すことでコンポーネントを除外することもできます
    const $filteredComponents = getComponentsByPrototype('Bar', ['#exclude-me', '.ignore-this']);
    ```

### ベストプラクティス

- コンポーネントのライフサイクルメソッドで**常に`super.connectedCallback()`と`super.disconnectedCallback()`を呼び出す**ことで、適切な登録/登録解除を確保します。
- `id`を使用して、コンポーネントを一意に識別し、特定のインスタンスと対話します。
- 特に同じコンポーネントタイプの複数のインスタンスが関与する場合、`$componentsManager.get()`メソッドを活用して、中央でコンポーネントを管理および制御します。
