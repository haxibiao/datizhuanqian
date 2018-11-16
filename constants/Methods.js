import { NavigationActions } from "react-navigation";
import Toast from "react-native-root-toast";
import Colors from "./Colors";
/*防止页面重复跳转
使用方法：navigation.dispatch(navigationAction({...}))
routeName  路由注册的routeName
params 要合并到目标路由的参数
action 在子路由器中运行的子操作
key 路由的标识符*/
function navigationAction({ routeName, params = null, action = null, key = routeName + Math.random().toString() }) {
	return NavigationActions.navigate({
		routeName,
		params,
		action,
		key
	});
}

/*需要登录验证的操作
login 是否登录
action 用户操作
navigation */
function operationMiddleware({ login, action, navigation }) {
	if (login) {
		action();
	} else {
		navigation.dispatch(navigationAction({ routeName: "登录注册" }));
	}
}

// 数字格式化
function numberFormat(number) {
	number = parseFloat(number);
	if (number >= 10000) {
		return (number / 10000).toFixed(1) + "w";
	} else {
		return number;
	}
}

function toast(message, timeout = 2000) {
	let toast = Toast.show(message, {
		duration: Toast.durations.LONG,
		position: 120,
		shadow: true,
		animation: true,
		hideOnPress: true,
		delay: 100,
		backgroundColor: Colors.nightColor
	});
	setTimeout(function() {
		Toast.hide(toast);
	}, timeout);
}

export { navigationAction, operationMiddleware, numberFormat, toast };
