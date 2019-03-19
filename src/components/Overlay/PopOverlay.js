/*
 * @flow
 * created by wyk made in 2019-01-08 13:06:22
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Overlay } from 'teaset';
import { Theme, PxFit, WPercent } from '../../utils';
import SafeText from '../Basics/SafeText';
import TouchFeedback from '../TouchableView/TouchFeedback';

type args = {
	title?: string,
	content: any,
	onConfirm: Function
};

function renderContent(content) {
	if (typeof content === 'string') {
		return <Text style={styles.messageText}>{content}</Text>;
	} else {
		return content;
	}
}

function PopOverlay(props: args) {
	let { title, content, onConfirm } = props,
		popViewRef,
		overlayView;
	overlayView = (
		<Overlay.PopView
			style={{ alignItems: 'center', justifyContent: 'center' }}
			animated
			ref={ref => (popViewRef = ref)}
		>
			<View style={styles.overlayInner}>
				<SafeText style={styles.headerText}>{title || '提示'}</SafeText>
				{content && renderContent(content)}
				<View style={styles.control}>
					<TouchFeedback
						style={styles.cancel}
						onPress={() => {
							popViewRef.close();
						}}
					>
						<Text style={styles.cancelText}>取消</Text>
					</TouchFeedback>
					<TouchFeedback
						style={styles.confirm}
						onPress={() => {
							onConfirm && onConfirm();
							popViewRef.close();
						}}
					>
						<Text style={styles.confirmText}>确定</Text>
					</TouchFeedback>
				</View>
			</View>
		</Overlay.PopView>
	);
	Overlay.show(overlayView);
}

const styles = StyleSheet.create({
	overlayInner: {
		width: WPercent(80),
		paddingTop: PxFit(20),
		paddingHorizontal: PxFit(20),
		backgroundColor: '#fff',
		borderRadius: PxFit(6)
	},
	headerText: {
		fontSize: PxFit(19),
		color: Theme.defaultTextColor,
		textAlign: 'center'
	},
	messageText: {
		fontSize: PxFit(16),
		marginVertical: PxFit(20),
		color: Theme.secondaryTextColor,
		textAlign: 'center'
	},
	control: {
		height: PxFit(46),
		flexDirection: 'row',
		alignItems: 'stretch',
		borderTopWidth: PxFit(1),
		borderTopColor: Theme.borderColor
	},
	cancel: {
		flex: 1,
		justifyContent: 'center'
	},
	confirm: {
		flex: 1,
		justifyContent: 'center'
	},
	cancelText: {
		textAlign: 'center',
		fontSize: PxFit(16),
		color: Theme.subTextColor,
		borderRightWidth: PxFit(1),
		borderRightColor: Theme.borderColor
	},
	confirmText: {
		textAlign: 'center',
		fontSize: PxFit(16),
		color: Theme.primaryColor
	}
});

export default PopOverlay;
