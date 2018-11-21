import types from "../types";
import { List } from "immutable";
import { users } from "../state/users";

class UsersReducer {
	static reduce(state = users(), action) {
		if (UsersReducer[action.type]) {
			return UsersReducer[action.type](state, action);
		} else {
			return state;
		}
	}
}

export default UsersReducer.reduce;
