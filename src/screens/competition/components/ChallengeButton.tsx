import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Avatar, Row, Center, Iconfont } from '@src/components';
import { Theme, PxFit, SCREEN_WIDTH } from '@src/utils';
import { BoxShadow } from 'react-native-shadow';
import { GQL, useMutation } from '@src/apollo';
import { observer, app } from 'store';

const challenge = observer(props => {
    const { onPress, matching } = props;
    return (
        <BoxShadow setting={shadowOpt}>
            <TouchableOpacity onPress={onPress} style={styles.matchingButton}>
                <Image style={styles.battle} source={require('@src/assets/images/battle.png')} />
                <Text style={styles.text}>{matching ? '取消匹配' : '立即PK'}</Text>
            </TouchableOpacity>
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
        width: PxFit(40),
        height: PxFit(40),
    },
    challenge: {
        width: PxFit(140),
        height: PxFit(140),
        padding: PxFit(10),
        overflow: 'hidden',
        borderRadius: PxFit(70),
    },
    matchingButton: {
        width: PxFit(120),
        height: PxFit(120),
        borderRadius: PxFit(60),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: PxFit(10),
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
        fontSize: PxFit(16),
    },
});

export default challenge;
