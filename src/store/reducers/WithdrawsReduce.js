import types from '../types';
import { List } from 'immutable';
import { withdraws } from '../state/withdraws';

class withdrawsReducer {
	static reduce(state = withdraws(), action) {
		if (withdrawsReducer[action.type]) {
			return withdrawsReducer[action.type](state, action);
		} else {
			return state;
		}
	}
}

export default withdrawsReducer.reduce;
