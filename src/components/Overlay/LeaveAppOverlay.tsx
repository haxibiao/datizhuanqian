'use strict';

import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';

import Iconfont from '../Iconfont';
import { Overlay } from 'teaset';
import DownLoadApk from '../Other/DownLoadApk';
import TouchFeedback from '../TouchableView/TouchFeedback';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

let OverlayKey: any = null;

interface Props {}

export const show = () => {
    const overlayView = (
        <Overlay.View animated>
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchFeedback
                        style={styles.close}
                        onPress={() => {
                            hide();
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
                                hide();
                            }}>
                            残忍离开
                        </Text>
                    </View>
                </View>
            </View>
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
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

export default { show, hide };
