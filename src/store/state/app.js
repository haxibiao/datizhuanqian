/*
 * @flow
 * created by wyk made in 2018-12-08 23:43:43
 */
import { Record, List } from 'immutable';

export default Record({
	loading: false,
	error: false,
	notification: null,
	offline: false,
	netInfo: null,
	exchangeRate: 600 //汇率
});
