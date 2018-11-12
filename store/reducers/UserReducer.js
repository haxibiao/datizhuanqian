import types from "../types";
import { List } from "immutable";
import { user } from "../state/user";

class UserReducer {
	static reduce(state = user(), action) {
		if (UserReducer[action.type]) {
			return UserReducer[action.type](state, action);
		} else {
			return state;
		}
	}
}

export default UserReducer.reduce;
