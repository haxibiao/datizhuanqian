import types from '../types';
import { rememberUser, forgetUser, rememberVersion } from './StorageActions';

function genericErrorHandler({ action, dispatch, error }) {
	console.log({ error, action });
}

export default [
	{
		action: types.SIGN_IN,
		effect: rememberUser,
		error: genericErrorHandler
	},
	{
		action: types.UPDATE_AVATAR,
		effect: rememberUser,
		error: genericErrorHandler
	},

	{
		action: types.UPDATE_NAME,
		effect: rememberUser,
		error: genericErrorHandler
	},
	{
		action: types.UPDATE_ALIPAY,
		effect: rememberUser,
		error: genericErrorHandler
	},
	{
		action: types.UPDATE_GOLD,
		effect: rememberUser,
		error: genericErrorHandler
	},
	{
		action: types.SIGN_OUT,
		effect: forgetUser,
		error: genericErrorHandler
	},
	{
		action: types.CANCEL_UPDATE,
		effect: rememberUser,
		error: genericErrorHandler
	},
	{
		action: types.UPDATE_VERSION,
		effect: rememberVersion,
		error: genericErrorHandler
	}
];
