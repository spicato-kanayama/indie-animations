const getJSTTimestamp = () => {
	// 現在のUTC時刻に9時間（日本時間の時差）をミリ秒換算して加算
	const now = new Date();
	const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

	// 各日時コンポーネントをUTCメソッドで取得し、2桁にパディング
	const yyyy = jstDate.getUTCFullYear();
	const mm = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
	const dd = String(jstDate.getUTCDate()).padStart(2, '0');
	const hh = String(jstDate.getUTCHours()).padStart(2, '0');
	const min = String(jstDate.getUTCMinutes()).padStart(2, '0');
	const ss = String(jstDate.getUTCSeconds()).padStart(2, '0');

	// 指定の形式に組み立てて返す
	return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
};

export default {
	files: ['*'],
	variables: {
		createdAt: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
		createdAtFormat: getJSTTimestamp(),
	},
};
