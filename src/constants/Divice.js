import { Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';

//设备宽高   刘海屏手机目前没有计算状态栏高度
const { width, height } = Dimensions.get('window');

const isIos = Platform.OS == 'ios';
let STATUSBAR_HEIGHT = isIos ? 20 : StatusBar.currentHeight;
let bottom_height = 0;

//适配iPhone X
if (isIos && height >= width * 2) {
	STATUSBAR_HEIGHT = 35;
	bottom_height = 20;
}

const wp = widthPercent => {
	const elemWidth = parseFloat(widthPercent);
	return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};

const hp = heightPercent => {
	const elemHeight = parseFloat(heightPercent);
	return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
};

const listenOrientationChange = that => {
	Dimensions.addEventListener('change', newDimensions => {
		width = newDimensions.window.width;
		height = newDimensions.window.height;

		that.setState({
			orientation: width < height ? 'portrait' : 'landscape'
		});
	});
};

const removeOrientationListener = () => {
	Dimensions.removeEventListener('change', () => null);
};

export default {
	isIos,
	width,
	height,
	STATUSBAR_HEIGHT,
	bottom_height,
	HEADER_HEIGHT: 40 + STATUSBAR_HEIGHT,
	BOTTOM_BAR_HEIGHT: 50,
	wp,
	hp,
	listenOrientationChange,
	removeOrientationListener
};
