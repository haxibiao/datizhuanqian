import { Record, List } from 'immutable';
import { Config } from '../../utils';
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
	server: {
		// mainApi: Config.ServerRoot
	}
});
