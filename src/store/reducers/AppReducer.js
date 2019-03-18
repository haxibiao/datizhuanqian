/*
* @flow
* created by wyk made in 2018-12-08 23:49:06
*/
import types from '../types';
import { List } from 'immutable';
import createAppState from '../state/app';

class AppReducer {
	static reduce(state = createAppState(), action) {
		if (AppReducer[action.type]) {
			return AppReducer[action.type](state, action);
		} else {
			return state;
		}
	}

	static [types.SHOW_LOADING_SPINNER](state, action) {
		return state.set('loading', action.status);
	}

	static [types.HIDDEN_LOADING_SPINNER](state, action) {
		return state.set('loading', action.status);
	}

	static [types.NET_INFO](state, action) {
		return state.set('netInfo', action.info);
	}

	static [types.DEVICE_OFFLINE](state, action) {
		return state.set('offline', action.status);
	}
}

export default AppReducer.reduce;
