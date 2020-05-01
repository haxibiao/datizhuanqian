/*
 * @flow
 * created by wyk made in 2019-09-10 14:32:24
 */
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

function WithdrawGuidance() {
    return (
        <View style={styles.flexCenter}>
            <Image style={styles.answerGuide} source={require('@src/assets/images/bg_withdraw_guidance.png')} />
        </View>
    );
}

const WIDTH = Device.WIDTH * 0.8;
const HEIGHT = (WIDTH * 370) / 801;
// const RIGHT = WIDTH / 2 - (WIDTH * 140) / 411;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    answerGuide: {
        position: 'absolute',
        top: HEIGHT * 2.6,
        left: PxFit(10),
        // right: RIGHT,
        width: WIDTH,
        height: HEIGHT,
        resizeMode: 'contain',
    },
});

export default WithdrawGuidance;
