/*
* @flow
* wyk created it in 2018-12-04 15:46:29
* tip: default statusBar is transparent
*/
'use strict';

import { Platform, Dimensions, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Mixes from './Mixes';
const { width, height } = Dimensions.get('window');

const HAS_NOTCH = DeviceInfo.hasNotch();
let HAS_HOME_INDICATOR = false;
let HOME_INDICATOR_HEIGHT = 0;

if (Platform.OS === 'ios' && HAS_NOTCH) {
  HAS_HOME_INDICATOR = true;
  HOME_INDICATOR_HEIGHT = 30;
}

const Theme = {
  ...Mixes,
  navBarContentHeight: 44,
  HAS_NOTCH,
  HAS_HOME_INDICATOR,
  HOME_INDICATOR_HEIGHT,

  get isLandscape() {
    return Dimensions.get('window').width > Dimensions.get('window').height;
  },

  get statusBarHeight() {
    if (Platform.OS === 'ios') {
      return this.isLandscape ? 0 : HAS_NOTCH ? HOME_INDICATOR_HEIGHT + 10 : 20;
    } else if (Platform.OS === 'android') {
      let statusBar_height = StatusBar.currentHeight;
      return HAS_NOTCH ? statusBar_height + 20 : statusBar_height;
    }
    return this.isLandscape ? 0 : 20;
  }
};

export default Theme;
