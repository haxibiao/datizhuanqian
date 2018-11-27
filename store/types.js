export default defineActionConstants([
	//首页

	//登录
	"SIGN_IN",
	"SIGN_OUT",

	//用户
	"UPDATE_AVATAR",
	"UPDATE_NAME",
	"UPDATE_COUNTS",
	"UPDATE_INTRODUCTION",
	"UPDATE_RESOURCE_COUNT",
	"UPDATA_PASSWORD",
	"UPDATE_ALIPAY",

	// 本地缓存
	"CLEAR_ALL"
]);

function defineActionConstants(names) {
	return names.reduce((result, name) => {
		result[name] = name;
		return result;
	}, {});
}
