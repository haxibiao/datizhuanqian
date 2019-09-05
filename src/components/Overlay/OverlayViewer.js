/*
 * @flow
 * created by wyk made in 2019-01-16 16:06:13
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, NAVBAR_HEIGHT } from '../../utils';
import { Overlay } from 'teaset';
import Iconfont from '../Iconfont';
import TouchFeedback from '../TouchableView/TouchFeedback';

class OverlayViewer {
	static show(children) {
		let overlayView = (
			<Overlay.View animated>
				<View style={styles.container}>
					{children}
					<View style={styles.header}>
						<TouchFeedback onPress={() => OverlayViewer.hide()}>
							<Iconfont name="close" size={PxFit(24)} color="#fff" />
						</TouchFeedback>
					</View>
				</View>
			</Overlay.View>
		);
		this.OverlayKey = Overlay.show(overlayView);
	}

	static hide() {
		Overlay.hide(this.OverlayKey);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		backgroundColor: '#000000'
	},
	header: {
		position: 'absolute',
		top: 0,
		width: '100%',
		height: PxFit(NAVBAR_HEIGHT),
		paddingTop: PxFit(Theme.statusBarHeight),
		paddingLeft: PxFit(Theme.itemSpace),
		paddingRight: PxFit(Theme.itemSpace),
		justifyContent: 'center',
		alignItems: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0.5)'
	}
});

export default OverlayViewer;
