/*
 * @flow
 * created by wyk made in 2019-03-22 16:01:34
 */
export function syncGetter(str, data) {
	if (data == null || typeof data !== 'object') return;
	let result = data;
	let keys = str.split('.');
	for (var i = 0; i < keys.length; i++) {
		if (result[keys[i]] !== undefined) {
			result = result[keys[i]];
		} else {
			return undefined;
		}
	}
	return result;
}
