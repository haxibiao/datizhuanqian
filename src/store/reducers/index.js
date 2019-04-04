import AppReducer from './AppReducer';
import QuestionReducer from './QuestionReducer';
import UsersReducer from './UsersReducer';
import TaskReducer from './TaskReducer';
import WithdrawsReduce from './WithdrawsReduce';

export default {
	app: AppReducer,
	question: QuestionReducer,
	users: UsersReducer,
	task: TaskReducer,
	withdraws: WithdrawsReduce
};
