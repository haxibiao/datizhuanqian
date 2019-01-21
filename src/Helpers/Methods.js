import Toast from 'react-native-root-toast';
import { Colors } from '../constants';

function toast(message, position, timeout = 2000) {
	let toast = Toast.show(message, {
		duration: Toast.durations.LONG,
		position: position,
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

function regular(account) {
	const phoneReg = /^1[3-9]\d{9}$/;
	const mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

	let value = phoneReg.test(account) || mailReg.test(account);
	return value;
}

export { regular, toast };
