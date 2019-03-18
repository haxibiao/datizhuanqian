/*
* @flow
* created by wyk made in 2018-12-08 23:49:49
*/
import types from '../types';
import { List, Record } from 'immutable';
import createPersonalState from '../state/personal';

class PersonalReducer {
	static reduce(state = createPersonalState(), action) {
		if (PersonalReducer[action.type]) {
			return PersonalReducer[action.type](state, action);
		} else {
			return state;
		}
	}

	static [types.SIGN_IN](state, action) {
		let { user } = action;
		global.TOKEN = user.token;
		return state.set('user', user).set('login', true);
	}

	static [types.SIGN_OUT](state, action) {
		global.TOKEN = null;
		console.log('TOKEN',TOKEN);
		return state.set('user', {}).set('login', false);
	}

	static [types.UPDATE_PROFILE](state, action) {
		let user = state.user;
		user = {
			...user,
			...action.profile
		};
		return state.set('user', user);
	}
}

export default PersonalReducer.reduce;
