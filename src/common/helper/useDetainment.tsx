import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, BackHandler, View, Text, TouchableOpacity, Image } from 'react-native';
import { Overlay } from 'teaset';

import { TouchFeedback, Iconfont } from '@src/components';
import DownLoadApk from '@src/screens/withdraw/components/DownLoadApk';

import { PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Theme } from '@src/utils';

export const useDetainment = (navigation: any, isEntry: boolean) => {
    const continuous = useRef(true);
    const firstExecute = useRef(isEntry);
    const entryListener = useRef();
    const overlayKey = useRef();
    // const navigation: any = useRef(Tools.rootNavigation);
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
                            懂得赚还有<Text style={{ color: Theme.theme }}>20+</Text>元未领取哦
                        </Text>
                    </View>
                    <View style={{ marginTop: PxFit(25), marginBottom: PxFit(10), alignItems: 'center' }}>
                        <DownLoadApk name={'去赚钱'} />
                        <Text
                            style={{ paddingTop: PxFit(5), fontSize: PxFit(13), color: Theme.grey }}
                            onPress={() => {
                                BackHandler.exitApp();
                            }}>
                            残忍离开
                        </Text>
                    </View>
                </View>
            </View>
        );
    }, []);

    const handle = useCallback(() => {
        // if (continuous.current) {
        //     // 确保在1.5s内连续点击两次
        //     continuous.current = false;
        //     Toast.show({ content: '再次点击退出', layout: 'bottom' });
        //     setTimeout(() => {
        //         continuous.current = true;
        //     }, 1500);
        //     return true;
        // }
        // 直接退出
        // return false;
        // 挽留弹窗

        overlayKey.current = Overlay.show(<Overlay.View animated>{OverlayContent}</Overlay.View>);
        return true;
    }, []);

    useEffect(() => {
        // App启动，首页navigation没有立马收到监听，需要自己挂载监听
        if (firstExecute.current && !entryListener.current) {
            entryListener.current = BackHandler.addEventListener('hardwareBackPress', handle);
        }
        let hardwareBackPressListener;
        navigation.addListener('willFocus', () => {
            if (firstExecute.current && entryListener.current) {
                entryListener.current.remove();
                firstExecute.current = false;
            }
            hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', handle);
        });
        navigation.addListener('willBlur', () => {
            if (firstExecute.current && entryListener.current) {
                entryListener.current.remove();
                firstExecute.current = false;
            }
            if (hardwareBackPressListener) {
                hardwareBackPressListener.remove();
                hardwareBackPressListener = null;
            }
        });
        return () => {
            if (firstExecute.current && entryListener.current) {
                entryListener.current.remove();
                firstExecute.current = false;
            }
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
});
