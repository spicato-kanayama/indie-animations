import { map } from 'nanostores';

/**
 * nanostores の subscribeKeys を使用して、特定のメディアステータスを監視することができます。
 * これにより、特定のメディアクエリの状態が変化したときにコールバック関数が呼び出されます。

import { $mediaStatus } from '@js/stores/deviceStatus';
import { subscribeKeys } from 'nanostores';

subscribeKeys($mediaStatus, ['isXLarge', 'isXXLarge'], (status) => {
	if (status.isXLarge) {
		console.log('XLarge screen detected');
	}
	if (status.isXXLarge) {
		console.log('XXLarge screen detected');
	}
}

*/

// =============================================================================
// Breakpoints
// =============================================================================
const root = document.documentElement;
const breakpointXs = getComputedStyle(root)
	.getPropertyValue('--breakpoint-xs')
	.trim();
const breakpointSm = getComputedStyle(root)
	.getPropertyValue('--breakpoint-sm')
	.trim();
const breakpointMd = getComputedStyle(root)
	.getPropertyValue('--breakpoint-md')
	.trim();
const breakpointLg = getComputedStyle(root)
	.getPropertyValue('--breakpoint-lg')
	.trim();
const breakpointXl = getComputedStyle(root)
	.getPropertyValue('--breakpoint-xl')
	.trim();
const breakpointXxl = getComputedStyle(root)
	.getPropertyValue('--breakpoint-xxl')
	.trim();

export const $breakpoints = map({
	xs: breakpointXs,
	sm: breakpointSm,
	md: breakpointMd,
	lg: breakpointLg,
	xl: breakpointXl,
	xxl: breakpointXxl,
});

// =============================================================================
// MediaQueries
// =============================================================================
export const $mediaQueries = map({
	reducedMotion: `(prefers-reduced-motion: reduce)`,
	touchScreen: `(hover: none)`,
	pointerDevice: `(any-hover: hover)`,
	XSmall: `screen and (min-width: ${$breakpoints.value?.xs})`,
	small: `screen and (min-width: ${$breakpoints.value?.sm})`,
	medium: `screen and (min-width: ${$breakpoints.value?.md})`,
	large: `screen and (min-width: ${$breakpoints.value?.lg})`,
	XLarge: `screen and (min-width: ${$breakpoints.value?.xl})`,
	XXLarge: `screen and (min-width: ${$breakpoints.value?.xxl})`,
});

// =============================================================================
// States
// =============================================================================
const mediaStatusQueries = {
	reducedMotion: matchMedia($mediaQueries.value?.reducedMotion || ''),
	touchScreen: matchMedia($mediaQueries.value?.touchScreen || ''),
	pointerDevice: matchMedia($mediaQueries.value?.pointerDevice || ''),
	XSmall: matchMedia($mediaQueries.value?.XSmall || ''),
	small: matchMedia($mediaQueries.value?.small || ''),
	medium: matchMedia($mediaQueries.value?.medium || ''),
	large: matchMedia($mediaQueries.value?.large || ''),
	XLarge: matchMedia($mediaQueries.value?.XLarge || ''),
	XXLarge: matchMedia($mediaQueries.value?.XXLarge || ''),
};

export const $mediaStatus = map({
	isReducedMotion: mediaStatusQueries.reducedMotion.matches,
	isTouchScreen: mediaStatusQueries.touchScreen.matches,
	isPointerDevice: mediaStatusQueries.pointerDevice.matches,
	isXSmall: mediaStatusQueries.XSmall.matches,
	isSmall: mediaStatusQueries.small.matches,
	isMedium: mediaStatusQueries.medium.matches,
	isLarge: mediaStatusQueries.large.matches,
	isXLarge: mediaStatusQueries.XLarge.matches,
	isXXLarge: mediaStatusQueries.XXLarge.matches,
});

for (const mediaQuery in mediaStatusQueries) {
	mediaStatusQueries[mediaQuery].addEventListener('change', () => {
		/**
		 * メディアクエリの文字列をプロパティ名に変換します。
		 * 最初の文字を大文字にし、'is'を接頭辞として追加します。
		 * 例: 'mobile' → 'isMobile'
		 * @param {string} mediaQuery - 変換するメディアクエリ文字列
		 * @returns {string} フォーマットされたプロパティ名
		 */

		const property = `is${mediaQuery.charAt(0).toUpperCase() + mediaQuery.slice(1)}`;
		$mediaStatus.setKey(property, mediaStatusQueries[mediaQuery].matches);
	});
}
