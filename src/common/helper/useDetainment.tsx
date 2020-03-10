import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, BackHandler, View, Text, Image, Linking } from 'react-native';
import { Overlay } from 'teaset';

import TouchFeedback from '@src/components/TouchableView/TouchFeedback';
import Iconfont from '@src/components/Iconfont';
import DownLoadApk from '@src/components/Utils/DownLoadApk';

import { PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Theme } from '@src/utils';

import { storage, keys } from 'store';
import { AppUtil } from 'native';

export const useDetainment = (navigation: any) => {
    const overlayKey = useRef();

    const OverlayContent = useMemo(() => {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchFeedback
                        style={styles.close}
                        onPress={() => {
                            Overlay.hide(overlayKey.current);
                            return true;
                        }}>
                        <Iconfont name={'close'} color={Theme.grey} size={18} />
                    </TouchFeedback>

                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('@src/assets/images/audit_refused.png')}
                            style={{ width: PxFit(108), height: PxFit(108) }}
                        />
                        <Text style={{ marginTop: PxFit(25), fontSize: PxFit(15) }}>真的要走嘛？</Text>
                        <Text style={{ marginTop: PxFit(5), fontSize: PxFit(15) }}>
                            答妹还有<Text style={{ color: Theme.theme }}>20+</Text>元未领取哦
                        </Text>
                    </View>
                    <View style={{ marginTop: PxFit(25), marginBottom: PxFit(10), alignItems: 'center' }}>
                        <TouchFeedback
                            onPress={() => {
                                AppUtil.CheckApkExist('com.damei', (data: any) => {
                                    if (data) {
                                        AppUtil.OpenApk('com.damei');
                                    } else {
                                        Linking.openURL(
                                            Device.IOS
                                                ? 'itms-apps://itunes.apple.com/app/id1462854524'
                                                : 'market://details?id=' + 'com.damei',
                                        );
                                    }
                                });
                            }}
                            style={styles.button}>
                            <Text style={styles.downloadText}>{'去试玩'}</Text>
                        </TouchFeedback>
                        <Text
                            style={{ paddingTop: PxFit(5), fontSize: PxFit(13), color: Theme.grey }}
                            onPress={() => {
                                BackHandler.exitApp();
                                storage.setItem(keys.leaveAppTips, true);
                            }}>
                            残忍离开
                        </Text>
                    </View>
                </View>
            </View>
        );
    }, []);

    const handle = useCallback(async () => {
        // 挽留弹窗
        const leaveAppTips = await storage.getItem(keys.leaveAppTips);

        if (!leaveAppTips) {
            overlayKey.current = Overlay.show(<Overlay.View animated>{OverlayContent}</Overlay.View>);
            return true;
        } else {
            BackHandler.exitApp();
        }
    }, []);

    useEffect(() => {
        let hardwareBackPressListener: any;
        navigation.addListener('willFocus', () => {
            hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', handle);
        });
        navigation.addListener('willBlur', () => {
            if (hardwareBackPressListener) {
                hardwareBackPressListener.remove();
                hardwareBackPressListener = null;
            }
        });
        return () => {
            if (hardwareBackPressListener) {
                hardwareBackPressListener.remove();
                hardwareBackPressListener = null;
            }
        };
    }, []);
};

const styles = StyleSheet.create({
    overlay: { alignItems: 'center', justifyContent: 'center' },
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    close: {
        paddingTop: PxFit(10),
        paddingHorizontal: PxFit(10),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    content: {
        width: SCREEN_WIDTH - PxFit(60),
        borderRadius: PxFit(15),
        backgroundColor: Theme.white,
        padding: 0,
    },
    button: {
        backgroundColor: Theme.primaryColor,
        borderRadius: PxFit(5),
        width: Device.WIDTH - PxFit(88),
        height: PxFit(42),
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadText: {
        color: '#FFF',
    },
});
