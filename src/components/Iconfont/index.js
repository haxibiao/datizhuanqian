/*
 * @flow
 * created by wyk made in 2018-12-08 17:31:27
 */
// import { createIconSet } from 'react-native-vector-icons';
// import createIconSet from 'react-native-vector-icons/lib/create-icon-set';
import createIconSet from './createIconSet';
import glyphMap from './iconfont';

const Iconfont = createIconSet(glyphMap, 'iconfont', require('../../assets/fonts/iconfont.ttf'));

export default Iconfont;
