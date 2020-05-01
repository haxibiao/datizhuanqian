/*
 * @flow
 * created by wyk made in 2019-04-26 12:45:13
 */
'use strict';

import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Overlay } from 'teaset';

import SafeText from '../Basics/SafeText';
import TouchFeedback from '../TouchableView/TouchFeedback';

type args = {
    title: string,
    content: any,
    onConfirm: Function,
    confirmContent: string,
};

function renderContent(content) {
    if (typeof content === 'string') {
        return <Text style={styles.messageText}>{'    ' + content}</Text>;
    } else {
        return content;
    }
}

class TipsOverlay {
    static show(props: args) {
        let { title, content, onConfirm, confirmContent } = props,
            overlayView;
        overlayView = (
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center' }}
                animated
                ref={ref => (popViewRef = ref)}>
                <View style={styles.overlayInner}>
                    <View style={{ marginVertical: PxFit(10) }}>
                        <SafeText style={styles.headerText}>{title || '提示'}</SafeText>
                        {content && renderContent(content)}
                    </View>
                    <View style={styles.modalFooter}>
                        <TouchFeedback
                            style={styles.operation}
                            onPress={() => {
                                TipsOverlay.hide();
                            }}>
                            <Text style={styles.operationText}>知道了</Text>
                        </TouchFeedback>

                        <TouchFeedback
                            style={[styles.operation, { borderLeftColor: Theme.lightBorder, borderLeftWidth: 0.5 }]}
                            onPress={() => {
                                TipsOverlay.hide();
                                onConfirm && onConfirm();
                            }}>
                            <Text style={[styles.operationText, { color: Theme.theme }]}>
                                {confirmContent || '查看'}
                            </Text>
                        </TouchFeedback>
                    </View>
                </View>
            </Overlay.PopView>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }
}

const styles = StyleSheet.create({
    overlayInner: {
        // minWidth: PxFit(200),
        width: Device.WIDTH - PxFit(40),
        padding: 0,
        backgroundColor: '#fff',
        borderRadius: PxFit(5),
    },
    headerText: {
        fontSize: PxFit(16),
        color: Theme.theme,
        textAlign: 'center',
        paddingVertical: PxFit(20),
    },
    messageText: {
        paddingTop: 10,
        fontSize: PxFit(12),
        color: Theme.theme,
        textAlign: 'center',
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
        fontSize: PxFit(14),
        fontWeight: '400',
        color: Theme.grey,
    },
});

export default TipsOverlay;
