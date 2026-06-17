import { defineConfig } from 'astro/config';
import Sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';

const chunkFileNames = new Map();

// https://astro.build/config
export default defineConfig({
	// HTMLのminify
	compressHTML: true,
	server: {
		host: true,
	},
	site: 'https://nolink.com#nolink',
	build: {
		inlineStylesheets: 'never',
	},
	devToolbar: {
		enabled: false,
	},
	vite: {
		environments: {
			client: {
				build: {
					rollupOptions: {
						output: {
							entryFileNames: (chunkInfo) => {
								const { facadeModuleId } = chunkInfo;
								let fileName;

								if (
									facadeModuleId &&
									facadeModuleId.includes('/src/')
								) {
									// クエリパラメータ(?astro&type=...) を除去
									const cleaned =
										facadeModuleId.split('?')[0];
									// /src/ 以降の相対パスを取得
									const rel = cleaned.split('/src/')[1];
									if (rel) {
										// 例: ['hoge','index.astro'] / ['hoge','fuga.astro'] / ['index.astro'] / ['hoge.astro']
										const segments = rel.split('/');
										if (segments.length === 1) {
											// index.astro -> index, hoge.astro -> hoge
											fileName = segments[0].replace(
												/\.astro$/,
												''
											);
										} else {
											const last =
												segments[segments.length - 1];
											if (last === 'index.astro') {
												// pages/hoge/index.astro -> hoge
												fileName =
													segments[
														segments.length - 2
													];
											} else {
												// pages/hoge/fuga.astro -> hoge-fuga
												// （より深い階層は仕様未提示のため直近親 + ファイル名で対応）
												const parent =
													segments[
														segments.length - 2
													];
												const base = last.replace(
													/\.astro$/,
													''
												);

												fileName =
													parent === base
														? base
														: `${parent}-${base}`;
											}
										}
									}

									// ファイル名が 'pages' のみの場合
									if (fileName === 'pages') {
										fileName = 'home';
									} else if (fileName?.startsWith('pages-')) {
										// 'pages-xxx' の場合、先頭の 'pages-' を削除
										fileName = fileName.replace(
											/^pages-/,
											''
										);
									}

									return `assets/js/${fileName}.min.js`;
								} else {
									return `assets/js/[name].min.js`;
								}
							},
							chunkFileNames: (chunkInfo) => {
								console.log('chunkInfo.name:', chunkInfo);

								const key = chunkInfo.name.toLowerCase();
								const count = chunkFileNames.get(key) || 0;

								chunkFileNames.set(key, count + 1);
								return `assets/js/chunk-[name]${count > 0 ? `-${count}` : ''}.min.js`;
							},
							assetFileNames: (assetInfo) => {
								const names = assetInfo.names;

								const isCss = names.some((name) =>
									/\.css$/.test(name)
								);
								const isImage = names.some((name) =>
									/\.(png|jpe?g|gif|webp|svg|ico)$/.test(name)
								);
								const isJs = names.some((name) =>
									/\.js$/.test(name)
								);

								if (isCss) {
									const exNameMatchImportant = String(
										assetInfo.source
									)
										.match(
											/--output-file-name-important:\s*([^}]+)/
										)?.[1]
										.trim()
										.replace(/;.*$/s, '');

									const exNameMatches = [
										...String(assetInfo.source).matchAll(
											/--output-file-name:\s*([^}]+)/g
										),
									];

									const exNameMatch =
										exNameMatches.length > 0
											? exNameMatches
													.map((item) =>
														item[1]
															.trim()
															.replace(
																/;.*$/s,
																''
															)
													)
													.join('-')
											: null;

									const fileName = exNameMatchImportant
										? exNameMatchImportant
										: exNameMatch
											? exNameMatch
											: '[name]';

									return `assets/css/${fileName}.min.css`;
								} else if (isImage) {
									return 'assets/images/[name].[ext]';
								} else if (isJs) {
									return 'assets/js/[name].min.js';
								} else {
									return 'assets/[name].[ext]';
								}
							},
						},
					},
				},
			},
		},
		experimental: {
			renderBuiltUrl(_, { hostType }) {
				if (hostType === 'js') {
					return { relative: true };
				}
			},
		},
	},
	integrations: [
		Sitemap(),
		playformCompress({
			CSS: true,
			HTML: {
				'html-minifier-terser': {
					removeAttributeQuotes: false,
				},
			},
			Image: false,
			JavaScript: true,
			SVG: false,
			Logger: 1,
		}),
	],
});
