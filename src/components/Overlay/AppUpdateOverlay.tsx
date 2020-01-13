'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    NativeModules,
    Dimensions,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { Config } from '../../utils';
import Theme from '../../utils/Theme';
import { WPercent, HPercent, PxFit, FontSize } from '../../utils/Scale';
import app from '../../store/app';

import Iconfont from '../Iconfont';
import { Overlay } from 'teaset';
import DownLoadApk from '@src/screens/withdraw/components/DownLoadApk';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

let OverlayKey: any = null;

interface Props {
    versionData: object;
    serverVersion: string;
}

export const show = (props: Props) => {
    const { versionData, serverVersion } = props;
    const overlayView = (
        <Overlay.View animated>
            <View style={styles.container}>
                <View style={styles.content}>
                    {!versionData.is_force && (
                        <TouchableOpacity
                            style={styles.operation}
                            onPress={() => {
                                hide();
                                app.updateViewedVesion(serverVersion);
                            }}>
                            <Iconfont name={'close'} color={Theme.grey} size={20} />
                        </TouchableOpacity>
                    )}
                    <View style={[styles.header, { paddingTop: versionData.is_force ? PxFit(25) : PxFit(15) }]}>
                        <Text style={styles.modalRemindContent}>检测到新版本</Text>
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.centerTitle}>建议在WLAN环境下进行升级</Text>
                        <Text style={styles.centerTitle}>版本：{versionData.version}</Text>
                        <Text style={styles.centerTitle}>大小：{versionData.size}</Text>
                        <Text style={styles.centerTitle}>更新说明：</Text>
                        <Text style={styles.centerInfo}>{versionData.description}</Text>
                    </View>
                    <View style={{ alignItems: 'center', paddingVertical: PxFit(15) }}>
                        <DownLoadApk packageName={'appUpdate'} />
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
    content: {
        width: SCREEN_WIDTH - PxFit(60),
        borderRadius: PxFit(15),
        backgroundColor: Theme.white,
        padding: 0,
    },
    header: {
        justifyContent: 'center',
    },
    headerText: {
        color: Theme.grey,
        fontSize: PxFit(13),
        textAlign: 'center',
        paddingTop: PxFit(3),
    },
    center: {
        paddingTop: PxFit(15),
        paddingBottom: PxFit(20),
        paddingHorizontal: PxFit(20),
    },
    centerTitle: {
        fontSize: PxFit(14),
        color: Theme.primaryFont,
        paddingTop: PxFit(10),
        lineHeight: PxFit(22),
    },
    centerInfo: {
        fontSize: PxFit(14),
        color: Theme.primaryFont,
        lineHeight: PxFit(22),
    },
    modalRemindContent: {
        fontSize: PxFit(18),
        color: Theme.black,
        paddingHorizontal: PxFit(15),
        textAlign: 'center',
        lineHeight: PxFit(20),
        fontWeight: '500',
    },
    modalFooter: {
        borderTopColor: Theme.tintGray,
        flexDirection: 'row',
    },
    operation: {
        paddingTop: PxFit(10),
        paddingHorizontal: PxFit(15),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    operationText: {
        fontSize: PxFit(15),
        fontWeight: '400',
        color: Theme.grey,
    },
});

export default { show, hide };
