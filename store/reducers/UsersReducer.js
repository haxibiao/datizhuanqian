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
	static [types.UPDATE_NAME](state, action) {
		let { user } = state;
		let { name } = action;
		user = {
			...user,
			name
		};
		return state.set("user", user);
	}

	static [types.UPDATE_AVATAR](state, action) {
		let { user } = state;
		let { avatar, timestamp } = action;
		user = {
			...user,
			avatar: avatar + "?" + timestamp
		};
		return state.set("user", user);
	}

	static [types.UPDATE_ALIPAY](state, action) {
		let { user } = state;
		let { account } = action;
		console.log("account", account);
		user = {
			...user,
			...account
		};
		return state.set("user", user);
	}
}

export default UsersReducer.reduce;
