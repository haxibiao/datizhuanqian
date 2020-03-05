import { PermissionsAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import service from 'service';
import { Util } from 'native';

export const readPhoneState = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const phoneNumber = await Util.getPhoneNumber();
            service.dataReport({
                data: {
                    category: '用户行为',
                    action: phoneNumber ? 'user_read_phone_state_success' : 'user_read_phone_state_fail',
                    name: phoneNumber ? '用户授权未获取到手机号' : '用户授权获取到手机号',
                    value: phoneNumber,
                },
            });
        } else {
            service.dataReport({
                data: {
                    category: '用户行为',
                    action: 'user_read_phone_state_fail',
                    name: '用户未授权未获取手机号',
                },
            });

            Toast.show({
                content: `${Config.AppName}需要读取您的手机号，已保证你能正常登录使用App`,
                duration: 2000,
            });
        }
    } catch (err) {
        console.warn(err);
    }
};
