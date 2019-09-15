/*
 * @flow
 * created by wyk made in 2019-09-12 11:19:10
 */
'use strict';

import React, { useMemo, useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS, Tools, WPercent } from 'utils';
import { Overlay } from 'teaset';

const SignedOverlay = props => {
	const { gold, withdraw } = props;

	const overlayRef = useRef();

	const getOverlayRef = useCallback(ref => {
		overlayRef.current = ref;
	}, []);

	const loadAd = useCallback(() => {
		//load video Ad
	}, []);

	return (
		<Overlay.View style={{ alignItems: 'center', justifyContent: 'center' }} animated={true} ref={getOverlayRef}>
			<ImageBackground
				style={styles.overlayImage}
				source={require('../../../assets/images/attendance_overlay.jpg')}>
				<View style={styles.overlayHeader}>
					<Text style={styles.whiteText1}>签到成功</Text>
					<Text style={styles.whiteText2}>
						恭喜获得
						<Text style={styles.highlightText}>{gold}</Text>
						智慧点
					</Text>
				</View>
				<View style={styles.TTAD}>
					<View style={styles.bannerAd}>
						<Text>banner Ad</Text>
					</View>
					<TouchableWithoutFeedback onPress={loadAd}>
						<ImageBackground
							style={styles.loadAdButton}
							source={require('../../../assets/images/attendance_button.png')}>
							<Text style={styles.buttonText}>领取更多奖励</Text>
						</ImageBackground>
					</TouchableWithoutFeedback>
				</View>
			</ImageBackground>
		</Overlay.View>
	);
};

const OVERLAY_WIDTH = WPercent(80);
const OVERLAY_HEIGHT = (OVERLAY_WIDTH * 2655) / 1819;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: PxFit(Theme.itemSpace),
	},
	overlayImage: {
		width: OVERLAY_WIDTH,
		height: OVERLAY_HEIGHT,
		paddingTop: (OVERLAY_HEIGHT * 510) / 2655,
		paddingHorizontal: OVERLAY_WIDTH * 0.1,
		borderRadius: PxFit(5),
		overflow: 'hidden',
		backgroundColor: '#fff',
	},
	overlayHeader: {
		height: (OVERLAY_HEIGHT * 1000) / 2655,
		justifyContent: 'center',
		alignItems: 'center',
	},
	whiteText1: {
		fontSize: PxFit(18),
		color: '#fff',
		fontWeight: 'bold',
		paddingBottom: PxFit(5),
	},
	whiteText2: {
		fontSize: PxFit(16),
		color: '#fff',
	},
	highlightText: {
		color: Theme.primaryColor,
	},
	TTAD: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	bannerAd: {
		alignSelf: 'stretch',
		height: OVERLAY_WIDTH * 0.2,
		borderRadius: PxFit(5),
		backgroundColor: '#efc0e4',
	},
	loadAdButton: {
		width: OVERLAY_WIDTH * 0.6,
		height: (OVERLAY_WIDTH * 0.6 * 258) / 995,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: PxFit(14),
		color: '#fff',
		fontWeight: 'bold',
	},
});

export default SignedOverlay;
