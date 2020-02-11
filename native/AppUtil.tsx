import { NativeModules, Platform } from 'react-native';
import { CodeIdSplash, CodeIdSplashIOS } from '@app/app.json';
import service from 'service';

const module = NativeModules.CheckApk;

export const CheckApkExist = (packageName: any, callback: Function) => {
    if (Platform.OS === 'ios') {
        return () => {
            return 0;
        };
    }
    return module.isPackageInstalled(packageName, callback);
};

export const OpenApk = (packageName: any) => {
    if (Platform.OS === 'ios') {
        return () => {
            return 0;
        };
    }
    return module.openApk(packageName);
};

export default { CheckApkExist, OpenApk };
