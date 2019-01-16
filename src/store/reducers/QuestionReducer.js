import types from "../types";
import { List } from "immutable";
import { question } from "../state/question";

class QuestionReducer {
	static reduce(state = question(), action) {
		if (QuestionReducer[action.type]) {
			return QuestionReducer[action.type](state, action);
		} else {
			return state;
		}
	}
}

export default QuestionReducer.reduce;
