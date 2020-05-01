import { Dimensions, PixelRatio } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const guidelineBaseWidth = 375;
//  'ios' ? 375 : 360;

// 宽高百分比
export const Percent = (number: any, type: 'width' | 'height' = 'width'): number => {
    const base = type === 'width' ? WINDOW_WIDTH : WINDOW_HEIGHT;
    const multiple = parseFloat(number) / 100;
    return PixelRatio.roundToNearestPixel(base * multiple);
};

// 样式大小适配
export const PxFit = (size: number) => (WINDOW_WIDTH / guidelineBaseWidth) * size;

// 字体大小适配
export const Font = (size: number) => size * PixelRatio.getFontScale();
