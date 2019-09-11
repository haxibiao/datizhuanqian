/*
 * @flow
 * created by wyk made in 2019-09-10 15:38:23
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { PxFit, Theme, SCREEN_WIDTH, NAVBAR_HEIGHT, SCREEN_HEIGHT, Tools } from 'utils';
import { app } from 'store';

function inputGuidance({ onDismiss }) {
	const [step, setStep] = useState(0);
	const guidesView = useMemo(() => {
		return [
			<TouchableWithoutFeedback
				key={1}
				onPress={() => {
					setStep(1);
				}}
			>
				<View style={styles.flexContainer}>
					<Image style={styles.guideImage01} source={require('../../assets/images/set_question_1_1.png')} />
					<Image style={styles.guideImage02} source={require('../../assets/images/set_question_1_2.png')} />
				</View>
			</TouchableWithoutFeedback>,
			<TouchableWithoutFeedback
				key={2}
				onPress={() => {
					onDismiss();
				}}
			>
				<View style={styles.flexContainer}>
					<Image style={styles.guideImage03} source={require('../../assets/images/set_question_2_1.png')} />
					<Image style={styles.guideImage04} source={require('../../assets/images/set_question_2_2.png')} />
				</View>
			</TouchableWithoutFeedback>
		];
	}, []);

	return guidesView[step];
}

function submitGuidance({ onDismiss }) {
	const [step, setStep] = useState(0);
	const guidesView = useMemo(() => {
		return [
			<TouchableWithoutFeedback
				key={1}
				onPress={() => {
					setStep(1);
				}}
			>
				<View style={styles.flexContainer}>
					<Image style={styles.guideImage05} source={require('../../assets/images/set_question_3_1.png')} />
				</View>
			</TouchableWithoutFeedback>,
			<TouchableWithoutFeedback
				key={2}
				onPress={() => {
					setStep(2);
				}}
			>
				<View style={styles.flexContainer}>
					<Image style={styles.guideImage06} source={require('../../assets/images/set_question_4_1.png')} />
				</View>
			</TouchableWithoutFeedback>,
			<TouchableWithoutFeedback
				key={3}
				onPress={() => {
					onDismiss();
				}}
			>
				<View style={styles.flexContainer}>
					<Image style={styles.guideImage07} source={require('../../assets/images/set_question_5_1.png')} />
					<Image style={styles.guideImage08} source={require('../../assets/images/set_question_5_2.png')} />
				</View>
			</TouchableWithoutFeedback>
		];
	}, []);

	return guidesView[step];
}

const G3Width = SCREEN_WIDTH * 0.45;
const G5Width = SCREEN_WIDTH - PxFit(Theme.itemSpace * 5);

const isSmallHeight = SCREEN_HEIGHT < 667;
const G3Height = (G3Width * 505) / 473;
const G5Height = (G5Width * 280) / 810;
const G6Height = ((SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2) * 445) / 1001;
const G7Height = ((SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2) * 357) / 1003;

const G5Top = isSmallHeight ? SCREEN_HEIGHT - G5Height : NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 6 + PxFit(360);
const G6Top = isSmallHeight ? SCREEN_HEIGHT - G6Height : NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 6 + PxFit(254);
const G7Top = isSmallHeight
	? SCREEN_HEIGHT - G7Height
	: NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 6 + PxFit(202) - (G7Height * 220) / 357;

const styles = StyleSheet.create({
	flexContainer: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT
	},
	guideImage01: {
		position: 'absolute',
		top: NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 3,
		right: PxFit(Theme.itemSpace),
		width: SCREEN_WIDTH / 2,
		height: ((SCREEN_WIDTH / 2) * 253) / 586,
		resizeMode: 'contain'
	},
	guideImage02: {
		position: 'absolute',
		top: NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 3 + PxFit(130),
		left: PxFit(Theme.itemSpace),
		width: SCREEN_WIDTH * 0.6,
		height: (SCREEN_WIDTH * 0.6 * 360) / 731,
		resizeMode: 'contain'
	},
	guideImage03: {
		position: 'absolute',
		top: NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 4 + PxFit(160) - (G3Height * 334) / 505,
		left: PxFit(Theme.itemSpace),
		width: G3Width,
		height: G3Height,
		resizeMode: 'contain'
	},
	guideImage04: {
		position: 'absolute',
		top: NAVBAR_HEIGHT + PxFit(Theme.itemSpace) * 6 + PxFit(160),
		right: PxFit(Theme.itemSpace) + PxFit(10),
		width: SCREEN_WIDTH / 2,
		height: ((SCREEN_WIDTH / 2) * 359) / 550,
		resizeMode: 'contain'
	},
	guideImage05: {
		position: 'absolute',
		top: G5Top,
		left: PxFit(Theme.itemSpace + 10),
		width: G5Width,
		height: G5Height,
		resizeMode: 'contain'
	},
	guideImage06: {
		position: 'absolute',
		top: G6Top,
		left: PxFit(Theme.itemSpace),
		width: SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2,
		height: G6Height,
		resizeMode: 'contain'
	},
	guideImage07: {
		position: 'absolute',
		top: G7Top,
		left: PxFit(Theme.itemSpace),
		width: SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2,
		height: G7Height,
		resizeMode: 'contain'
	},
	guideImage08: {
		position: 'absolute',
		top: PxFit(Theme.statusBarHeight),
		right: 0,
		width: 60 * (266 / 150),
		height: (60 * (266 / 150) * 285) / 266,
		resizeMode: 'contain'
	}
});

export default {
	inputGuidance,
	submitGuidance
};
