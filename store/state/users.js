import { Record, List } from "immutable";

export const users = Record({
	login: false,
	noTicketTips: true,
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
			time_ago: "18/11/14  13:25",
			money: "2.2",
			status: 1
		},
		{
			id: 2,
			time_ago: "18/11/15  09:25",
			money: "2.2",
			status: 0
		},
		{
			id: 1,
			time_ago: "18/11/15  15:42",
			money: "2.2",
			status: 1
		}
	],
	feedback: [
		{
			id: 1,
			description:
				"希望精力点能有更多一点,现在的精力点一下子就刷完了，建议多出一些任务可以回复精力点,或者可以买道具",
			images: ["http://cos.qunyige.com/storage/image/14434.jpg", "http://cos.qunyige.com/storage/avatar/13.jpg"],
			user: {
				id: 1,
				name: "风清歌",
				avatar: "http://cos.qunyige.com/storage/avatar/13.jpg"
			},
			time_ago: "9天前"
		},
		{
			id: 2,
			description:
				"希望精力点能有更多一点,现在的精力点一下子就刷完了，建议多出一些任务可以回复精力点,或者可以买道具",
			images: ["http://cos.qunyige.com/storage/image/14434.jpg", "http://cos.qunyige.com/storage/avatar/13.jpg"],
			user: {
				id: 1,
				name: "风清歌",
				avatar: "http://cos.qunyige.com/storage/avatar/13.jpg"
			},
			time_ago: "9天前"
		}
	]
});
