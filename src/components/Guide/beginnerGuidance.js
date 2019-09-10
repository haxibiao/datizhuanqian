/*
 * @flow
 * created by wyk made in 2018-12-05 20:53:57
 */
'use strict';

import React, { Component, useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { Overlay } from 'teaset';
import { storage, keys } from 'store';
import { PxFit, Theme, SCREEN_WIDTH, SCREEN_HEIGHT } from '../../utils';

type Props = {
    guidanceKey: string,
    GuidanceView: JSX.Element,
    dismissEnabled?: boolean,
    skipEnabled?: boolean
};

const beginnerGuidance = (props: Props) => {
    const { guidanceKey, GuidanceView, dismissEnabled, skipEnabled } = props;
    const guidanceType = `BeginnerGuidance_${guidanceKey}`;
    let OverlayKey;

    const overlayView = (
        <Overlay.View animated={true}>
            <TouchableWithoutFeedback disabled={!dismissEnabled} onPress={handleDismiss}>
                <View style={styles.container}>
                    <GuidanceView onDismiss={handleDismiss} />
                    {skipEnabled && (
                        <View style={styles.header}>
                            <TouchableWithoutFeedback onPress={handleDismiss}>
                                <View style={styles.closeBtn}>
                                    <Text style={styles.closeBtnText}>跳过引导</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </Overlay.View>
    );

    init();

    function handleDismiss() {
        console.log('handleDismiss');
        storage.setItem(guidanceType, JSON.stringify({}));
        Overlay.hide(OverlayKey);
    }

    async function init() {
        const result = await storage.getItem(guidanceType);
        console.log(`${guidanceType}`, result);
        if (!result) {
            OverlayKey = Overlay.show(overlayView);
        }
    }
};

// const BeginnerGuidance = (props: Props) => {
//     const { guidanceKey, GuidanceView, dismissEnabled } = props;
//     const guidanceType = useMemo(() => `BeginnerGuidance_${guidanceKey}`, []);
//     let OverlayKey;

//     const handleDismiss = useCallback(() => {
//         Overlay.hide(OverlayKey);
//         storage.setItem(guidanceType, JSON.stringify({}));
//     }, []);

//     const overlayView = useMemo(() => {
//         return (
//             <Overlay.View animated={true}>
//                 <View style={styles.container}>
//                     <TouchableWithoutFeedback disabled={!dismissEnabled} onPress={handleDismiss}>
//                         <GuidanceView onDismiss={handleDismiss} />
//                     </TouchableWithoutFeedback>
//                 </View>
//             </Overlay.View>
//         );
//     }, [guidanceKey]);

//     useEffect(async () => {
//         console.log('useEffect');
//         const result = await storage.getItem(guidanceType);
//         console.log('result', result);
//         if (!result) {
//             OverlayKey = Overlay.show(overlayView);
//             storage.setItem(guidanceType, JSON.stringify({}));
//         }
//     }, []);
// };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    header: {
        position: 'absolute',
        top: PxFit(Theme.statusBarHeight + 10),
        paddingHorizontal: PxFit(Theme.itemSpace),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    closeBtn: {
        height: PxFit(28),
        paddingHorizontal: PxFit(10),
        borderRadius: PxFit(14),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)'
    },
    closeBtnText: {
        fontSize: PxFit(15),
        color: '#fff'
    }
});

export default beginnerGuidance;
