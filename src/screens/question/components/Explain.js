/*
 * @flow
 * created by wyk made in 2019-06-27 15:04:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { observer, Provider, inject } from 'mobx-react';
import { TouchFeedback, Row, OverlayViewer } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import ImageViewer from 'react-native-image-zoom-viewer';

const MEDIA_WIDTH = SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2 - PxFit(12) * 2;

class Explain extends Component {
	showPicture = url => {
		let overlayView = (
			<ImageViewer
				onSwipeDown={() => OverlayViewer.hide()}
				imageUrls={[
					{
						url
					}
				]}
				enableSwipeDown
			/>
		);
		OverlayViewer.show(overlayView);
	};

	render() {
		let { text, picture } = this.props;
		if (!(text || picture)) {
			return null;
		}
		return (
			<View style={styles.shadowView} elevation={10}>
				<View style={styles.shadowTitle}>
					<Row>
						<View style={styles.yellowDot} />
						<Text style={styles.titleText}>题目解析</Text>
					</Row>
				</View>
				{text ? <Text style={styles.explainText}>{'   ' + text}</Text> : null}
				{picture && (
					<TouchFeedback onPress={() => this.showPicture(picture)}>
						<Image source={{ uri: picture }} style={styles.pictureStyle} />
					</TouchFeedback>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	shadowView: {
		marginBottom: PxFit(20),
		padding: PxFit(12),
		borderRadius: PxFit(5),
		backgroundColor: '#fff',
		shadowColor: '#b4b4b4',
		shadowOffset: {
			width: 0,
			height: 0
		},
		shadowRadius: 1,
		shadowOpacity: 0.3
	},
	shadowTitle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	yellowDot: {
		marginRight: PxFit(6),
		width: PxFit(6),
		height: PxFit(6),
		borderRadius: PxFit(3),
		backgroundColor: Theme.primaryColor
	},
	titleText: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	},
	explainText: {
		marginTop: PxFit(Theme.itemSpace),
		fontSize: PxFit(16),
		lineHeight: PxFit(24),
		color: Theme.defaultTextColor
	},
	pictureStyle: {
		marginTop: PxFit(10),
		width: MEDIA_WIDTH,
		height: MEDIA_WIDTH * 0.6,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Explain;
