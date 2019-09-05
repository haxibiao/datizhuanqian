/*
 * @flow
 * created by wyk made in 2019-01-31 10:19:02
 */
import { Dimensions, Platform, Lingking } from 'react-native';

class Link {
	static openLink(url: String) {
		Lingking.canOpenURL(url).then(supported => {
			if (supported) {
				Lingking.openURL(url);
			} else {
				Toast.show({ content: '无法打开该链接' });
			}
		});
	}
}
