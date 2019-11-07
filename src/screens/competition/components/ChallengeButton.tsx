import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Avatar, Row, Center, Iconfont } from '@src/components';
import { Theme, PxFit, SCREEN_WIDTH } from '@src/utils';
import { BoxShadow } from 'react-native-shadow';
import { GQL, useMutation } from '@src/apollo';
import { observer, app } from 'store';

const challenge = observer(props => {
    const { onPress, matching } = props;
    return (
        <BoxShadow setting={shadowOpt}>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={onPress} style={styles.matchingButton}>
                    <Image style={styles.battle} source={require('@src/assets/images/battle.png')} />
                    <Text style={styles.text}>{matching ? '取消匹配' : '立即PK'}</Text>
                </TouchableOpacity>
            </View>
        </BoxShadow>
    );
});

const shadowOpt = {
    width: PxFit(120),
    height: PxFit(120),
    color: '#fff',
    border: PxFit(10),
    radius: PxFit(60),
    opacity: 0.5,
    x: 0,
    y: 0,
};

const styles = StyleSheet.create({
    battle: {
        height: PxFit(40),
        width: PxFit(40),
    },
    matchingButton: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxFit(60),
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
        marginTop: PxFit(10),
    },
    wave: {
        borderRadius: PxFit(100),
    },
    waveContainer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
});

export default challenge;
