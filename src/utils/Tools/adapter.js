/*
 * @flow
 * created by wyk made in 2019-03-22 16:01:34
 */
export function syncGetter(str, data) {
	if (data == null || data == undefined || typeof data !== 'object') return;
	let result = Object.assign({}, data);
	let keys = str.split('.');
	for (let i = 0; i < keys.length; i++) {
		if (result[keys[i]] !== undefined && result[keys[i]] !== null) {
			result = result[keys[i]];
		} else {
			return undefined;
		}
	}
	return result;
}

export function throttle(fn, delay = 300) {
	let now, lastExec, timer, context, args;

	function execute() {
		fn(...args);
		lastExec = now;
	}
	return function() {
		now = new Date();
		args = Array.from(arguments);
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		if (lastExec) {
			let diff = delay - (now - lastExec);
			if (diff < 0) {
				execute();
			} else {
				timer = setTimeout(() => {
					execute();
				}, diff);
			}
		} else {
			execute();
		}
	};
}

export function debounce(fn, delay = 1000) {
	var timeout = null,
		args;
	return function() {
		args = Array.from(arguments);
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
}

export function isContained(aa, bb) {
	if (!(aa instanceof Array) || !(bb instanceof Array) || aa.length < bb.length) {
		return false;
	}
	var aaStr = aa.toString();
	for (var i = 0; i < bb.length; i++) {
		if (aaStr.indexOf(bb[i]) < 0) return false;
	}
	return true;
}

export function arrayRandomSort(arr) {
	if (!(arr instanceof Array)) {
		throw new Error(arr + 'is not a Array');
	}
	var res = [];
	for (var i = 0; i < arr.length; i++) {
		var randomIndex = Math.floor(Math.random() * arr.length);
		res[i] = arr[randomIndex];
		arr.splice(randomIndex, 1);
	}
	return res;
}

export function Mixes(obj1, obj2) {
	function isObject(obj) {
		if (typeof obj === 'object' && obj !== null) {
			return obj;
		} else {
			throw new Error(obj + 'is not a object');
		}
	}
	isObject(obj1);
	isObject(obj2);
	for (var k in obj2) {
		obj1[k] = obj2[k];
	}
	return obj1;
}
