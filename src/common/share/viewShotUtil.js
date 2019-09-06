import { Platform, PermissionsAndroid } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';

class viewShotUtil {
    static capture = viewRef => {
        return new Promise((resolve, reject) => {
            captureRef(viewRef).then(
                uri => {
                    resolve(uri);
                },
                error => console.warn('Oops, snapshot failed', error),
            );
        });
    };

    static saveImage = async (uri, isShow) => {
        if (Platform.OS === 'ios') {
            CameraRoll.saveToCameraRoll(uri);
            Toast.show({ content: '保存成功' });
        } else {
            try {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                    title: '需要访问您的相册',
                    message: '保存图片需要您开启该权限',
                });
                const result = await CameraRoll.saveToCameraRoll(uri, 'photo');
                if (isShow) {
                    Toast.show({ content: '已保存到相册' });
                }

                return result;
            } catch (err) {
                console.error('Failed to request permission ', err);
                Toast.show({ content: '保存失败' });
                return null;
            }
        }
    };
}

export default viewShotUtil;
