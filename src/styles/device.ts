import { Platform, Dimensions, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const deviceID = DeviceInfo.getDeviceId();
const { width, height } = Dimensions.get('window');
const navBarContentHeight = 44;
let HAS_NOTCH = DeviceInfo.hasNotch();
let HAS_HOME_INDICATOR = false;
let HOME_INDICATOR_HEIGHT = 0;

if (['iPhone12,1', 'iPhone12,3', 'iPhone12,5'].includes(deviceID)) {
    HAS_NOTCH = true;
    HOME_INDICATOR_HEIGHT = 26;
}

if (Platform.OS === 'ios' && HAS_NOTCH) {
    HAS_HOME_INDICATOR = true;
    HOME_INDICATOR_HEIGHT = 26;
}

const iPhone11 = () => {
    if (['iPhone12,1', 'iPhone12,3', 'iPhone12,5'].includes(deviceID)) {
        HAS_NOTCH = true;
        HOME_INDICATOR_HEIGHT = 26;
        return true;
    }
};

const statusBarHeight = () => {
    if (Platform.OS === 'ios') {
        return isLandscape() ? 0 : HAS_NOTCH ? 34 : 20;
    } else if (Platform.OS === 'android') {
        return StatusBar.currentHeight || 48;
    }
    return isLandscape() ? 0 : 20;
};

const isLandscape = () => {
    return width > height;
};

export const adapter = {
    navBarContentHeight,
    HAS_NOTCH,
    HAS_HOME_INDICATOR,
    HOME_INDICATOR_HEIGHT,
    statusBarHeight: statusBarHeight(),
    iPhone11,
    WIDTH: width,
    HEIGHT: height,
    NAVBAR_HEIGHT: navBarContentHeight + statusBarHeight(),
};
