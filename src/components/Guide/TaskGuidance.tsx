/*
 * @flow
 * created by wyk made in 2019-09-10 14:32:24
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { PxFit, Theme, SCREEN_WIDTH, NAVBAR_HEIGHT, SCREEN_HEIGHT, Tools } from 'utils';

function TaskGuidance({ onDismiss }) {
    return (
        <View style={styles.flexCenter}>
            <Image style={styles.answerGuide} source={require('@src/assets/images/task_guide.png')} />
        </View>
    );
}

const WIDTH = SCREEN_WIDTH;
const HEIGHT = (WIDTH * 1059) / 1040;
const TOP = SCREEN_HEIGHT - HEIGHT / 2;
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
