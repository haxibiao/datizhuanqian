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
	static [types.SIGN_IN](state, action) {
		let { user } = action;
		return state.set("user", user).set("login", true);
	}
	static [types.SIGN_OUT](state, action) {
		return state.set("user", {}).set("login", false);
	}
}

export default UsersReducer.reduce;
