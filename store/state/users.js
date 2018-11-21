import { Record, List } from "immutable";

export const users = Record({
	login: true,
	user: {
		avatar: "http://cos.qunyige.com/storage/avatar/13.jpg",
		name: "风清歌",
		id: 1,
		aliplay: 13007465219,
		count_energy: 5,
		count_wisdom: 252,
		level: 3,
		exp: 1368
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
	]
});
