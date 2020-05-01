import { PermissionsAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import service from 'service';
import { Util } from 'native';
import { Matomo } from 'native';

export const readPhoneState = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const phoneNumber = await Util.getPhoneNumber();
            const name = phoneNumber ? '点击同意授权未获取到手机号' : '点击同意授权获取到手机号';
            //matomo 数据上报
            Matomo.trackEvent('用户行为', name, name, 1);
        } else {
            const name = '点击不同意授权获取手机号';
            //matomo 数据上报
            Matomo.trackEvent('用户行为', name, name, 1);
            Toast.show({
                content: `${Config.AppName}需要读取您的手机号，已保证你能正常登录使用App`,
                duration: 2000,
            });
        }
    } catch (err) {
        console.warn(err);
    }
};
