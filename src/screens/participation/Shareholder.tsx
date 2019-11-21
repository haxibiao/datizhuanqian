import React, { useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { Theme, PxFit, WPercent } from 'utils';
import { HxfButton } from 'components';
import { app } from 'store';

interface Props {
    serialNumber: number;
    shares: number;
}

const Shareholder = (props: Props) => {
    const onPress = useCallback(() => {
        props.onClose();
        props.onPress();
    }, [props]);
    return (
        <ImageBackground style={styles.overlayImage} source={require('@src/assets/images/shareholder.png')}>
            <View style={styles.overlayHeader}>
                <Text style={styles.text1}>恭喜您成为</Text>
                <Text style={styles.text1}>{`答妹第${props.serialNumber}位股东`} </Text>
                <Text style={styles.text2}>
                    送您<Text style={styles.highlight}>{` ${props.shares} `}</Text>份红股
                </Text>
                <Text style={styles.text2}>可每天领取分红收益</Text>
            </View>
            <View style={styles.buttonWrap}>
                <HxfButton
                    onPress={onPress}
                    gradient={true}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['#CEB684', '#EAE0CA']}
                    title={<Text style={styles.buttonText}>立即体验</Text>}
                    style={styles.button}
                />
            </View>
        </ImageBackground>
    );
};

const OVERLAY_WIDTH = WPercent(80);
const OVERLAY_HEIGHT = (OVERLAY_WIDTH * 788) / 608;

const styles = StyleSheet.create({
    button: {
        borderRadius: OVERLAY_WIDTH * 0.7,
        height: OVERLAY_WIDTH * 0.15,
        width: OVERLAY_WIDTH * 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: PxFit(16),
    },
    buttonWrap: {
        alignItems: 'center',
        height: (OVERLAY_HEIGHT * 196) / 788,
        justifyContent: 'center',
    },
    highlight: {
        color: Theme.secondaryColor,
        fontWeight: 'bold',
    },
    overlayHeader: {
        alignItems: 'center',
        height: (OVERLAY_HEIGHT * 290) / 788,
        justifyContent: 'center',
    },
    overlayImage: {
        height: OVERLAY_HEIGHT,
        marginBottom: (OVERLAY_HEIGHT * 64) / 788,
        marginLeft: (OVERLAY_HEIGHT * 40) / 608,
        paddingBottom: (OVERLAY_HEIGHT * 30) / 788,
        paddingRight: (OVERLAY_HEIGHT * 40) / 608,
        paddingTop: (OVERLAY_HEIGHT * 262) / 788,
        width: OVERLAY_WIDTH,
    },
    text1: {
        color: '#CEB683',
        fontSize: PxFit(18),
        fontWeight: 'bold',
        paddingBottom: PxFit(6),
    },
    text2: {
        color: '#CEB683',
        fontSize: PxFit(16),
        paddingBottom: PxFit(4),
    },
});

export default Shareholder;
