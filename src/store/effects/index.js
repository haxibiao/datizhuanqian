import types from '../types';
import {
	rememberUser,
	forgetUser,
	appIntroVersion,
	updateTipsVersion,
	rememberUserCache,
	rememberCategoryCache
} from './StorageActions';

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
		action: types.UPDATE_GENDER,
		effect: rememberUser,
		error: genericErrorHandler
	},
	{
		action: types.SIGN_OUT,
		effect: forgetUser,
		error: genericErrorHandler
	},
	{
		action: types.CHANGE_UPDATE_TIPS_VERSION,
		effect: updateTipsVersion,
		error: genericErrorHandler
	},
	{
		action: types.UPDATE_APP_INTRO_VERSION,
		effect: appIntroVersion,
		error: genericErrorHandler
	},
	{
		action: types.USER_CACHE,
		effect: rememberUserCache,
		error: genericErrorHandler
	},
	{
		action: types.CATEGORY_CACHE,
		effect: rememberCategoryCache,
		error: genericErrorHandler
	}
];
