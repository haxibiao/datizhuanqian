/*
 * @Author: Gaoxuan
 * @Date:   2019-08-16 15:59:52
 * @Last Modified by:   Gaoxuan
 * @Last Modified time: 2019-08-16 15:59:52
 */
import { NativeModules, Alert, Platform } from 'react-native';

export const AlipayAuth = (): Promise<string> => {
    return NativeModules.AlipayEntryModule.AlipayAuth();
};

export default { AlipayAuth };
