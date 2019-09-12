/*
 * @flow
 * created by wyk made in 2019-09-10 14:32:24
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { PxFit, Theme, SCREEN_WIDTH, NAVBAR_HEIGHT, SCREEN_HEIGHT, Tools } from 'utils';

function AnswerGuidance({ onDismiss }) {
	return (
		<View style={styles.flexCenter}>
			<Image style={styles.answerGuide} source={require('../../assets/images/answer_guide.png')} />
		</View>
	);
}

const WIDTH = (411 * 46) / 122;
const HEIGHT = (WIDTH * 719) / 411;
const TOP = PxFit(NAVBAR_HEIGHT);
const RIGHT = WIDTH / 2 - (WIDTH * 140) / 411;

const styles = StyleSheet.create({
	flexCenter: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center'
	},
	answerGuide: {
		position: 'absolute',
		top: TOP,
		right: RIGHT,
		width: WIDTH,
		height: HEIGHT,
		resizeMode: 'contain'
	}
});

export default AnswerGuidance;
