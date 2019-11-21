import React, { useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Theme, PxFit, WPercent } from 'utils';
import { app } from 'store';

// interface Props {
//     earnings: number;
// }

const ProfitRemind = props => {
    const onPress = useCallback(() => {
        props.onPress();
        props.onClose();
    }, [props]);
    return (
        <ImageBackground style={styles.overlayImage} source={require('@src/assets/images/participation_profit.png')}>
            <View style={styles.overlayContent}>
                <View style={styles.title}>
                    <Text style={styles.text1}>您有离线分红收益</Text>
                    <Text style={styles.text2}>超时未领取将会过期，快去领取吧</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>立即查看</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const OVERLAY_WIDTH = WPercent(76);
const OVERLAY_HEIGHT = (OVERLAY_WIDTH * 600) / 480;

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: OVERLAY_WIDTH * 0.7,
        height: OVERLAY_WIDTH * 0.15,
        justifyContent: 'center',
        width: OVERLAY_WIDTH * 0.7,
    },
    buttonText: {
        color: Theme.secondaryColor,
        fontSize: PxFit(16),
    },
    overlayContent: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    overlayImage: {
        height: OVERLAY_HEIGHT,
        paddingTop: (OVERLAY_HEIGHT * 260) / 600,
        width: OVERLAY_WIDTH,
    },
    text1: {
        color: '#fff',
        fontSize: PxFit(20),
        fontWeight: 'bold',
    },
    text2: {
        color: '#fff',
        fontSize: PxFit(15),
        marginTop: PxFit(15),
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: PxFit(30),
    },
});

export default ProfitRemind;
