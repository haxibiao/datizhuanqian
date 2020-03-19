import { Dimensions, PixelRatio } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

const guidelineBaseWidth = 375;

// 样式适配
export const size = (size: number) => (WINDOW_WIDTH / guidelineBaseWidth) * size;

// 字体大小适配
export const font = (size: number) => size * PixelRatio.getFontScale();
