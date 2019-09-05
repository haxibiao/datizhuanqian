/*
 * @flow
 * created by wyk made in 2018-12-05 21:08:16
 */
import { PixelRatio, Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');

// 百分比适配
export const WPercent = (widthPercent: number) => {
	const elemWidth = parseFloat(widthPercent);
	return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};

export const HPercent = (heightPercent: number) => {
	const elemHeight = parseFloat(heightPercent);
	return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
};

// 分辨率适配
// PixelDensity等于2
// android：物理分辨率720*1080  逻辑分辨率360pt*540pt
// iPhone6：物理分辨率750*1334  逻辑分辨率375pt*667pt
const basePx = Platform.OS === 'ios' ? 375 : 360;
export const PxFit = function(px: number): number {
	const adaptivePx = (px / basePx) * width;
	return PixelRatio.roundToNearestPixel(adaptivePx);
};

// 文字适配（弃用）
// 1 ：mdpi Android devices（160 dpi）
// 1.5：hdpi Android devices（240 dpi）
// 2 ：iphone 4，4s，5，5s，5c，6，6s，7
//     xhdip Android devices（320 dpi）
// 3 ：iphone 6 plus，6s plus，7 plus
// xxhdpi Android devices（480 dpi）
// 3.5：Nexus 6
const PixelDensity = PixelRatio.get();
export const FontSize = (size: number) => {
	if (PixelDensity === 2) {
		// iphone 5s and older Androids
		if (width < 360) {
			return size * 0.95;
		}
		// iphone 5
		if (height < 667) {
			return size;
			// iphone 6-6s
		} else if (height >= 667 && height <= 735) {
			return size * 1.15;
		}
		// older phablets
		return size * 1.25;
	}
	if (PixelDensity === 3) {
		// catch Android font scaling on small machines
		// where pixel ratio / font scale ratio => 3:3
		if (width <= 360) {
			return size;
		}
		// Catch other weird android width sizings
		if (height < 667) {
			return size * 1.15;
			// catch in-between size Androids and scale font up
			// a tad but not too much
		}
		if (height >= 667 && height <= 735) {
			return size * 1.2;
		}
		// catch larger devices
		// ie iphone 6s plus / 7 plus / mi note 等等
		return size * 1.27;
	}
	if (PixelDensity === 3.5) {
		// catch Android font scaling on small machines
		// where pixel ratio / font scale ratio => 3:3
		if (width <= 360) {
			return size;
			// Catch other smaller android height sizings
		}
		if (height < 667) {
			return size * 1.2;
			// catch in-between size Androids and scale font up
			// a tad but not too much
		}
		if (height >= 667 && height <= 735) {
			return size * 1.25;
		}
		// catch larger phablet devices
		return size * 1.4;
	}
	// if older device ie pixelRatio !== 2 || 3 || 3.5
	return size;
};
