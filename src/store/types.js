export default defineActionConstants([
	//首页

	//登录
	'SIGN_IN',
	'SIGN_OUT',
	'SET_USER',
	//用户
	'UPDATE_AVATAR',
	'UPDATE_NAME',
	'UPDATE_COUNTS',
	'UPDATE_INTRODUCTION',
	'UPDATE_RESOURCE_COUNT',
	'UPDATA_PASSWORD',
	'UPDATE_ALIPAY',
	'UPDATE_GOLD',
	'UPDATE_GENDER',
	'RECORD_OPERATION',
	'WIDTH_DRAWS',
	'VIEWED_UPDATE_VERSION',
	'UPDATE_APP_INTRO_VERSION',
	'UPDATE_SERVER',
	'SET_SERVER',

	// 本地缓存
	'USER_CACHE',
	'CATEGORY_CACHE',
	'CLEAR_ALL'
]);

function defineActionConstants(names) {
	return names.reduce((result, name) => {
		result[name] = name;
		return result;
	}, {});
}
