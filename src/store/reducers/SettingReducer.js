/*
* @flow
* created by wyk made in 2018-12-09 20:53:40
*/
import types from '../types';
import { List } from 'immutable';
import createSettingState from '../state/setting';

class SettingReducer {
	static reduce(state = createSettingState(), action) {
		if (SettingReducer[action.type]) {
			return SettingReducer[action.type](state, action);
		} else {
			return state;
		}
	}

	static [types.ADD_WATER_MARKE](state, action) {
		return state.set('addWatermark', action.status);
	}
}

export default SettingReducer.reduce;
