/*
 * @Author: Gaoxuan
 * @Date:   2019-05-28 16:30:05
 */
'use strict';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Overlay } from 'teaset';
import { TouchFeedback } from '@src/components';

class ManualOverly {
    static show(title, content) {
        let overlayView = (
            <Overlay.PullView
                containerStyle={{ backgroundColor: Theme.white }}
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                animated
                ref={ref => (this.popViewRef = ref)}>
                <View style={styles.actionSheetView}>
                    <TouchFeedback
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 15,
                            borderBottomColor: Theme.lightBorder,
                            borderBottomWidth: PxFit(0.5),
                        }}>
                        <Text style={{ fontSize: 16 }}>{title}</Text>
                    </TouchFeedback>
                    <View style={styles.content}>
                        <Text style={{ lineHeight: 20 }}>{content}</Text>
                    </View>
                </View>
            </Overlay.PullView>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }
}

const styles = StyleSheet.create({
    actionSheetView: {
        minHeight: Device.HEIGHT / 3,
        marginBottom: Device.HOME_INDICATOR_HEIGHT,
        overflow: 'hidden',
    },
    content: {
        paddingHorizontal: PxFit(15),
        paddingVertical: PxFit(15),
    },
});

export default ManualOverly;
