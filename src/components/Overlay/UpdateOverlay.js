/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, NativeModules, Dimensions } from 'react-native';
// import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../utils';
import Theme from '../../utils/Theme';
import { WPercent, HPercent, PxFit, FontSize } from '../../utils/Scale';
import app from '../../store/app';

import { Overlay } from 'teaset';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

class UpdateOverlay {
    static show(versionData, serverVersion) {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.modalRemindContent}>检测到新版本</Text>
                        </View>
                        <View style={styles.center}>
                            <Text style={styles.centerTitle}>建议在WLAN环境下进行升级</Text>
                            <Text style={styles.centerTitle}>版本：{versionData.version}</Text>
                            <Text style={styles.centerTitle}>大小：{versionData.size}</Text>
                            <Text style={styles.centerTitle}>更新说明：</Text>
                            <Text style={styles.centerInfo}>{versionData.description}</Text>
                        </View>

                        <View style={styles.modalFooter}>
                            {!versionData.is_force && (
                                <TouchableOpacity
                                    style={styles.operation}
                                    onPress={() => {
                                        UpdateOverlay.hide();
                                        app.updateViewedVesion(serverVersion);
                                    }}>
                                    <Text style={styles.operationText}>以后再说</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.operation,
                                    versionData.is_force
                                        ? null
                                        : { borderLeftColor: Theme.lightBorder, borderLeftWidth: 0.5 },
                                ]}
                                onPress={() => {
                                    NativeModules.DownloadApk.downloading(
                                        versionData.apk,
                                        'datizhuanqian.apk',
                                        '答题赚钱',
                                    );
                                    UpdateOverlay.hide();
                                }}>
                                <Text style={[styles.operationText, { color: Theme.theme }]}>立即更新</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }
}

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
    header: { justifyContent: 'center', paddingTop: PxFit(25) },
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
        borderTopWidth: PxFit(0.5),
        borderTopColor: Theme.tintGray,
        flexDirection: 'row',
    },
    operation: {
        paddingVertical: PxFit(15),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    operationText: {
        fontSize: PxFit(15),
        fontWeight: '400',
        color: Theme.grey,
    },
});

export default UpdateOverlay;
