import { Record, List } from 'immutable';

export const question = Record({
	question: [
		{
			id: 1,
			title: '英雄联盟S1的冠军是？',
			answer: 3,
			option: {
				a: 'SKT',
				b: 'WE',
				c: 'Fnatic',
				d: 'TPA'
			},
			value: 1
		},
		{
			id: 2,
			title: '中国英雄联盟第一个世界冠军是？',
			answer: 2,
			option: {
				a: 'EDG',
				b: 'WE',
				c: 'IG',
				d: 'RNG'
			},
			value: 1
		},
		{
			id: 3,
			title: '绝地求生S1897的弹夹有少发子弹？',
			answer: 2,
			option: {
				a: '5',
				b: '7',
				c: '9',
				d: '15'
			},
			value: 1
		}
	],
	prop: [
		{
			id: 1,
			logo: 'http://pic40.photophoto.cn/20160811/0007020070469426_b.jpg',
			name: '道具1',
			value: 3
		},
		{
			id: 2,
			logo: 'http://pic40.photophoto.cn/20160811/0007020070469426_b.jpg',
			name: '道具2',
			value: 3
		},
		{
			id: 3,
			logo: 'http://pic40.photophoto.cn/20160811/0007020070469426_b.jpg',
			name: '道具3',
			value: 1
		}
	]
});
