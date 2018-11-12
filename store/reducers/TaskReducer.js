import types from "../types";
import { List } from "immutable";
import { task } from "../state/task";

class TaskReducer {
	static reduce(state = task(), action) {
		if (TaskReducer[action.type]) {
			return TaskReducer[action.type](state, action);
		} else {
			return state;
		}
	}
}

export default TaskReducer.reduce;
