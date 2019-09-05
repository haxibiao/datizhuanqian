import { NativeModules, Platform } from 'react-native';

export const getPhoneNumber = (): Promise<string> => {
	return NativeModules.AppUtilModule.test();
};

export default { getPhoneNumber };
