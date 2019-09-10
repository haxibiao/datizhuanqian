/*
 * @flow
 * created by wyk made in 2018-12-05 21:47:45
 */

import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

const SCREEN_WIDTH = width;

// number Format
export function NumberFormat(number) {
	number = parseFloat(number);
	if (number >= 1000) {
		return Math.round((number / 1000).toFixed(2) * 10) / 10 + 'k';
	} else {
		return number || 0;
	}
}
// time Format
export function TimeFormat(second) {
	let h = 0,
		i = 0,
		s = parseInt(second);
	if (s > 60) {
		i = parseInt(s / 60);
		s = parseInt(s % 60);
	}
	// 补零
	let zero = function(v) {
		return v >> 0 < 10 ? '0' + v : v;
	};
	return [zero(h), zero(i), zero(s)].join(':');
}

// response images layout
export function singleImageResponse(width: number, height: number, max: number) {
	let size = {};
	if (width > max || height > max) {
		if (width >= height) {
			size.width = max;
			size.height = Math.round((max * height) / width);
		} else {
			size.height = max;
			size.width = Math.round((max * width) / height);
		}
	} else {
		size = { width, height };
	}
	return size;
}

//postItem images response
export function gridImage(imgCount, space = 4, maxWidth = divece.width) {
	let width,
		height,
		i = 0;
	let imgSize = [];
	switch (true) {
		case imgCount == 1:
			maxWidth = (maxWidth * 2) / 3;
			width = maxWidth;
			height = maxWidth / 2;
			imgSize.push({ width, height, marginRight: space, marginTop: space });
			break;
		case imgCount == 7:
			for (; i < imgCount; i++) {
				if (i == 0) {
					width = maxWidth;
					height = maxWidth / 2;
				} else {
					width = height = (maxWidth - space * 2) / 3;
				}
				imgSize.push({ width, height, marginRight: space, marginTop: space });
			}
			break;
		case imgCount == 5:
		case imgCount == 8:
			for (; i < imgCount; i++) {
				if (i == 0 || i == 1) {
					width = height = (maxWidth - space) / 2;
				} else {
					width = height = (maxWidth - space * 2) / 3;
				}
				imgSize.push({ width, height, marginRight: space, marginTop: space });
			}
			break;
		case imgCount == 2:
		case imgCount == 4:
			width = height = (maxWidth - space) / 2;
			for (; i < imgCount; i++) {
				imgSize.push({ width, height, marginRight: space, marginTop: space });
			}
			break;
		case imgCount == 3:
		case imgCount == 6:
		case imgCount == 9:
			width = height = (maxWidth - space * 2) / 3;
			for (; i < imgCount; i++) {
				imgSize.push({ width, height, marginRight: space, marginTop: space });
			}
			break;
	}
	return imgSize;
}

export function imgsLayoutSize(imgCount, images, space = 5, maxWidth = width - 30) {
	let width,
		height,
		i = 0;
	let imgSize = [];
	switch (true) {
		case imgCount == 1:
			if (images[0].height > images[0].width) {
				height = (maxWidth * 2) / 3;
				width = (height * images[0].width) / images[0].height;
				imgSize.push({ width, height, marginTop: space });
			} else {
				if (images[0].width > maxWidth) {
					width = maxWidth;
					height = (width * images[0].height) / images[0].width;
					imgSize.push({ width, height, marginTop: space });
				} else {
					width = images[0].width;
					height = images[0].height;
					imgSize.push({ width, height, marginTop: space });
				}
			}

			break;
		case imgCount == 7:
			for (; i < imgCount; i++) {
				if (i == 0) {
					width = maxWidth;
					height = maxWidth / 2;
				} else {
					width = height = (maxWidth - space * 2) / 3;
				}
				imgSize.push({ width, height, marginLeft: space, marginTop: space });
			}
			break;
		case imgCount == 5:
		case imgCount == 8:
			for (; i < imgCount; i++) {
				if (i == 0 || i == 1) {
					width = height = (maxWidth - space) / 2;
				} else {
					width = height = (maxWidth - space * 2) / 3;
				}
				imgSize.push({ width, height, marginLeft: space, marginTop: space });
			}
			break;

		case imgCount == 2:
		case imgCount == 4:
			width = height = (maxWidth - space) / 2;
			for (; i < imgCount; i++) {
				imgSize.push({ width, height, marginRight: space, marginTop: space });
			}
			break;
		case imgCount == 3:
		case imgCount == 6:
		case imgCount == 9:
			width = height = (maxWidth - space * 2) / 3;
			for (; i < imgCount; i++) {
				imgSize.push({ width, height, marginRight: space, marginTop: space });
			}
			break;
	}
	return imgSize;
}

export function generateGenderLable(gender: '男' | '女' | '保密') {
	switch (gender) {
		case '男':
			return { name: 'boy', color: '#00C8FF' };
			break;
		case '女':
			return { name: 'girl', color: '#FF5C9D' };
			break;
		default:
			return { name: 'boy', color: '#00C8FF' };
	}
}

export function imageSize({ width, height, padding }) {
	var size = {};
	if (width > SCREEN_WIDTH) {
		size.width = SCREEN_WIDTH - padding;
		size.height = ((SCREEN_WIDTH - padding) * height) / width;
	} else {
		size = { width, height };
	}
	return size;
}

//手机 邮箱 正则验证
export function regular(account) {
	const phoneReg = /^1[3-9]\d{9}$/;
	const mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

	let value = phoneReg.test(account) || mailReg.test(account);
	return value;
}
