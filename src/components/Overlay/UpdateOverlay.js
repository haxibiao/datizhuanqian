/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, NativeModules } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, NAVBAR_HEIGHT } from '../../utils';
import { Overlay } from 'teaset';
import Iconfont from '../Iconfont';

import { connect } from 'react-redux';
import actions from '../../store/actions';

class UpdateOverlay {
	static show(versionData, serverVersion, dispatch) {
		let overlayView = (
			<Overlay.View animated>
				<View style={styles.container}>
					<View style={style.content}>
						<View style={styles.header}>
							<Text style={styles.modalRemindContent}>发现新版本</Text>
							<Text style={styles.headerText}>版本号：V{versionData.version}</Text>
						</View>
						<View style={styles.center}>
							<Text style={styles.centerTitle}>更新提示：</Text>
							<Text style={styles.centerInfo}>{versionData.description}</Text>
						</View>

						<View style={styles.modalFooter}>
							<TouchableOpacity
								style={styles.operation}
								onPress={() => {
									UpdateOverlay.hide();
									dispatch(serverVersion);
								}}
							>
								<Text style={styles.operationText}>以后再说</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.operation, { borderLeftColor: Theme.lightBorder, borderLeftWidth: 0.5 }]}
								onPress={() => {
									NativeModules.DownloadApk.downloading(versionData.apk, 'datizhuanqian.apk');
								}}
							>
								<Text style={[styles.operationText, { color: Theme.theme }]}>立即更新</Text>
							</TouchableOpacity>
						</View>
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
		backgroundColor: 'rgba(255,255,255,0)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	content: {
		width: SCREEN_WIDTH - PxFit(60),
		borderRadius: PxFit(15),
		backgroundColor: Theme.white,
		padding: 0
	},
	header: { justifyContent: 'center', paddingTop: PxFit(25) },
	headerText: {
		color: Theme.grey,
		fontSize: PxFit(13),
		textAlign: 'center',
		paddingTop: PxFit(3)
	},
	center: {
		paddingBottom: PxFit(20),
		paddingHorizontal: PxFit(20)
	},
	centerTitle: {
		fontSize: PxFit(14),
		color: Theme.primaryFont,
		paddingTop: PxFit(10),
		lineHeight: PxFit(22)
	},
	centerInfo: {
		fontSize: PxFit(14),
		color: Theme.primaryFont,
		lineHeight: PxFit(22)
	},
	modalRemindContent: {
		fontSize: PxFit(18),
		color: Theme.black,
		paddingHorizontal: PxFit(15),
		textAlign: 'center',
		lineHeight: PxFit(20),
		fontWeight: '500'
	},
	modalFooter: {
		borderTopWidth: PxFit(0.5),
		borderTopColor: Theme.tintGray,
		flexDirection: 'row'
	},
	operation: {
		paddingVertical: PxFit(15),
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	operationText: {
		fontSize: PxFit(15),
		fontWeight: '400',
		color: Theme.grey
	}
});

export default UpdateOverlay;
