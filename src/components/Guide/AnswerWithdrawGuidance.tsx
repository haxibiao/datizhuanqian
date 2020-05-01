/*
 * @flow
 * created by wyk made in 2019-09-10 14:32:24
 */
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

function TaskGuidance() {
    return (
        <View style={styles.flexCenter}>
            <Image style={styles.answerGuide} source={require('@src/assets/images/bg_answer_withdraw_guidance.png')} />
        </View>
    );
}

const WIDTH = Device.WIDTH * 0.6;
const HEIGHT = (WIDTH * 1129) / 887;
// const RIGHT = WIDTH / 2 - (WIDTH * 140) / 411;

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
        // top: HEIGHT * 0.65,
        // right: RIGHT,
        width: WIDTH,
        height: HEIGHT,
        resizeMode: 'contain',
    },
});

export default TaskGuidance;
