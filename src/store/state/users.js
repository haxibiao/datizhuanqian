import { Record, List } from 'immutable';

export const users = Record({
	login: false,
	noTicketTips: true,
	isUpdate: true,
	user: {
		// avatar: "http://cos.qunyige.com/storage/avatar/13.jpg",
		// name: "风清歌",
		// id: 1,
		// aliplay: 13007465219,
		// count_energy: 5,
		// count_wisdom: 252,
		// level: 3,
		// exp: 1368
	},
	log: [
		{
			id: 1,
			time_ago: '18/11/14  13:25',
			money: '2.2',
			status: 1
		},
		{
			id: 2,
			time_ago: '18/11/15  09:25',
			money: '2.2',
			status: 0
		},
		{
			id: 1,
			time_ago: '18/11/15  15:42',
			money: '2.2',
			status: 1
		}
	],
	feedback: [
		{
			id: 1,
			description:
				'希望精力点能有更多一点,现在的精力点一下子就刷完了，建议多出一些任务可以回复精力点,或者可以买道具',
			images: ['http://cos.qunyige.com/storage/image/14434.jpg', 'http://cos.qunyige.com/storage/avatar/13.jpg'],
			user: {
				id: 1,
				name: '风清歌',
				avatar: 'http://cos.qunyige.com/storage/avatar/13.jpg'
			},
			time_ago: '9天前'
		},
		{
			id: 2,
			description:
				'希望精力点能有更多一点,现在的精力点一下子就刷完了，建议多出一些任务可以回复精力点,或者可以买道具',
			images: ['http://cos.qunyige.com/storage/image/14434.jpg', 'http://cos.qunyige.com/storage/avatar/13.jpg'],
			user: {
				id: 1,
				name: '风清歌',
				avatar: 'http://cos.qunyige.com/storage/avatar/13.jpg'
			},
			time_ago: '9天前'
		}
	],
	prop: [
		{
			id: 1,
			logo:
				'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545019358036&di=a658ef0ff0e65adf97cdce2712f288f6&imgtype=0&src=http%3A%2F%2Fp0.so.qhimgs1.com%2Ft0119ab6c82fbe06810.jpg',
			name: '金',
			description: '增加20精力点',
			time_ago: '2018-12-16  09:35:00',
			status: 1
		},
		{
			id: 2,
			logo:
				'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545019358036&di=a658ef0ff0e65adf97cdce2712f288f6&imgtype=0&src=http%3A%2F%2Fp0.so.qhimgs1.com%2Ft0119ab6c82fbe06810.jpg',
			name: '木',
			description: '增加20精力点',
			time_ago: '2018-12-16  09:35:00',
			status: 0
		}
	],
	notification: [
		{
			id: 1,
			type: 1,
			time_ago: '2天前',
			user: {
				id: 1,
				alipay: '13007465219',
				next_level_exp: 50,
				ticket: 180,
				level: {
					id: 1,
					name: '初来乍到',
					ticket_max: 180,
					level: 1
				}
			},
			transaction: {
				id: 1,
				amount: 10,
				created_at: '2018年12月20日 16:10:01'
			}
		},
		{
			id: 2,
			type: 2,
			time_ago: '10小时前',
			user: {
				id: 2,
				alipay: '13007465219',
				next_level_exp: 50,
				ticket: 180,
				level: {
					id: 1,
					name: '初来乍到',
					ticket_max: 180,
					level: 1
				}
			},
			transaction: {
				id: 1,
				amount: 10,
				created_at: '2018年12月20日 16:10:01'
			}
		},
		{
			id: 3,
			type: 3,
			time_ago: '15分钟前',
			user: {
				id: 1,
				alipay: '13007465219',
				next_level_exp: 50,
				ticket: 180,
				level: {
					id: 1,
					name: '初来乍到',
					ticket_max: 180,
					level: 1
				}
			},
			transaction: {
				id: 1,
				amount: 10,
				created_at: '2018年12月20日 16:10:01'
			}
		}
	]
});