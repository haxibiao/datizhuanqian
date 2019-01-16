import glyphMap from './glyphmaps/Iconfont.json';
import createIconSet from './createIconSet';

export default createIconSet(glyphMap, 'iconfont', require('../assets/fonts/iconfont.ttf'));
