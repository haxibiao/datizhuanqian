import { NativeModules, Platform } from 'react-native';
import { CodeIdFullVideo, CodeIdFullVideoIOS } from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdFullVideoIOS : CodeIdFullVideo;
const module = NativeModules.FullScreenVideo;

const adArgs = {
    codeid,
};

export const loadFullScreenVideoAd = (): Promise<string> => {
    return module.loadAd(adArgs);
};

export const startFullScreenVideoAd = () => {
    return module.startAd(adArgs);
};

export default { loadFullScreenVideoAd, startFullScreenVideoAd };
