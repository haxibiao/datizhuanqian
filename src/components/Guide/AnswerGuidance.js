/*
 * @flow
 * created by wyk made in 2019-09-10 14:32:24
 */
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

function AnswerGuidance() {
    return (
        <View style={styles.flexCenter}>
            <Image style={styles.answerGuide} source={require('@src/assets/images/bg_answer_guide.png')} />
        </View>
    );
}

// const WIDTH = (411 * 46) / 122;
const WIDTH = Device.WIDTH * 0.68;
const HEIGHT = (WIDTH * 445) / 728;
const TOP = Device.NAVBAR_HEIGHT;
const RIGHT = WIDTH / 2 - (WIDTH * 140) / 411;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerGuide: {
        position: 'absolute',
        top: TOP,
        left: Device.WIDTH * 0.12,
        width: WIDTH,
        height: HEIGHT,
        resizeMode: 'contain',
        // backgroundColor: '#F0F',
    },
});

export default AnswerGuidance;
