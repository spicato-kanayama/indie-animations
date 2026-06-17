/**
 * Youtube API を読み込む必要あり(headタグにscriptタグを追加)
 * <script src="https://www.youtube.com/iframe_api" defer></script>
 **/

export default class YoutubeController {
	/**
	 * @param {Object} Option
	 * @param {String} Option.wrapper - YouTubeのiframeを囲う要素
	 * @param {String} Option.id - YouTubeのid
	 */
	constructor({ wrapper, id }) {
		this.wrapper = document.querySelector(wrapper);
		this.id = id;
		this.getEventType = window.ontouchstart ? 'touchstart' : 'click';

		// APIでのYouTube動画制御
		// @ts-ignore
		this.player;

		(function onYouTubeIframeAPIReady() {
			// @ts-ignore
			// eslint-disable-next-line no-undef
			this.player = new YT.Player(this.wrapper, {
				videoId: this.id,
				playerVars: {
					rel: 0,
				},
			});
		})();
	}

	pause() {
		this.player?.pauseVideo();
	}
}
