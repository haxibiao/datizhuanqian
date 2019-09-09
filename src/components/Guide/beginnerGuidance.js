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
    dismissEnabled?: boolean
};

const beginnerGuidance = (props: Props) => {
    const { guidanceKey, GuidanceView, dismissEnabled } = props;
    const guidanceType = `BeginnerGuidance_${guidanceKey}`;
    let OverlayKey;

    const overlayView = (
        <Overlay.View animated={true}>
            <View style={styles.container}>
                <TouchableWithoutFeedback disabled={!dismissEnabled} onPress={handleDismiss}>
                    <GuidanceView onDismiss={handleDismiss} />
                </TouchableWithoutFeedback>
            </View>
        </Overlay.View>
    );

    init();

    function handleDismiss() {
        Overlay.hide(OverlayKey);
        storage.setItem(guidanceType, JSON.stringify({}));
    }

    async function init() {
        console.log('useEffect');
        const result = await storage.getItem(guidanceType);
        console.log('result', result);
        OverlayKey = Overlay.show(overlayView);
        storage.setItem(guidanceType, JSON.stringify({}));
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
    }
});

export default beginnerGuidance;
