import { NativeModules, Platform } from 'react-native';
import { CodeIdSplash, CodeIdSplashIOS } from '@app/app.json';
import service from 'service';

const module = NativeModules.CheckApk;

export const CheckApkExist = (packageName: any, callback: Function) => {
    return module.isPackageInstalled(packageName, callback);
};

export const OpenApk = (packageName: any) => {
    return module.openApk(packageName);
};

export default { CheckApkExist, OpenApk };
