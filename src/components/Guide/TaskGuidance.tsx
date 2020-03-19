/*
 * @flow
 * created by wyk made in 2019-09-10 14:32:24
 */
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils';

function TaskGuidance() {
    return (
        <View style={styles.flexCenter}>
            <Image style={styles.answerGuide} source={require('@src/assets/images/task_guide.png')} />
        </View>
    );
}

const WIDTH = SCREEN_WIDTH;
const HEIGHT = (WIDTH * 1059) / 1040;
// const RIGHT = WIDTH / 2 - (WIDTH * 140) / 411;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerGuide: {
        position: 'absolute',
        // top: TOP,
        // right: RIGHT,
        width: WIDTH,
        height: HEIGHT,
        resizeMode: 'contain',
    },
});

export default TaskGuidance;
