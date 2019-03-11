import types from '../types';
import { List } from 'immutable';
import { users } from '../state/users';

class UsersReducer {
	static reduce(state = users(), action) {
		if (UsersReducer[action.type]) {
			return UsersReducer[action.type](state, action);
		} else {
			return state;
		}
	}
	static [types.SET_USER](state, action) {
		let { user } = action;
		return state.set('user', user);
	}

	static [types.SIGN_IN](state, action) {
		let { user } = action;
		return state.set('user', user).set('login', true);
	}

	static [types.SIGN_OUT](state, action) {
		return state
			.set('user', {})
			.set('login', false)
			.set('noTicketTips', true);
	}

	static [types.UPDATE_NAME](state, action) {
		let { user } = state;
		let { name } = action;
		user = {
			...user,
			name
		};
		return state.set('user', user);
	}

	static [types.UPDATE_AVATAR](state, action) {
		let { user } = state;
		let { avatar } = action;
		user = {
			...user,
			avatar: avatar
		};
		return state.set('user', user);
	}

	static [types.UPDATE_INTRODUCTION](state, action) {
		let { user } = state;
		let { introduction } = action;
		user = {
			...user,
			introduction
		};
		return state.set('user', user);
	}

	static [types.UPDATE_ALIPAY](state, action) {
		let { user } = state;
		let { account } = action;
		user = {
			...user,
			...account
		};
		return state.set('user', user);
	}

	static [types.UPDATE_GOLD](state, action) {
		let { user } = state;
		let { gold } = action;
		user = {
			...user,
			gold: gold
		};
		return state.set('user', user);
	}
	static [types.UPDATE_GENDER](state, action) {
		let { user } = state;
		let { gender } = action;
		user = {
			...user,
			gender: gender
		};
		return state.set('user', user);
	}

	static [types.RECORD_OPERATION](state, action) {
		let { noTicketTips } = action;
		return state.set('noTicketTips', noTicketTips);
	}
	static [types.CANCEL_UPDATE](state, action) {
		let { isUpdate } = action;
		return state.set('isUpdate', isUpdate);
	}

	static [types.UPDATE_SERVER](state, action) {
		let { server } = action;
		return state.set('server', server);
	}

	static [types.SET_SERVER](state, action) {
		let { server } = action;
		return state.set('server', server);
	}
}

export default UsersReducer.reduce;
