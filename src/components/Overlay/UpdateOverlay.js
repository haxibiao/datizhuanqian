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
		console.log('versionData', dispatch);
		let overlayView = (
			<Overlay.View animated>
				<View style={styles.container}>
					<View
						style={{
							width: SCREEN_WIDTH - 60,
							borderRadius: 15,
							backgroundColor: Theme.white,
							padding: 0
						}}
					>
						<View style={{ justifyContent: 'center', paddingTop: 25 }}>
							<Text style={styles.modalRemindContent}>发现新版本</Text>
							<Text style={{ color: Theme.grey, fontSize: 13, textAlign: 'center', paddingTop: 3 }}>
								版本号：V{versionData.version}
							</Text>
						</View>
						<View style={{ paddingBottom: 20, paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 14, color: Theme.primaryFont, paddingTop: 10, lineHeight: 22 }}>
								更新提示：
							</Text>
							<Text style={{ fontSize: 14, color: Theme.primaryFont, lineHeight: 22 }}>
								{versionData.description}
							</Text>
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
	modalRemindContent: {
		fontSize: 18,
		color: Theme.black,
		paddingHorizontal: 15,
		textAlign: 'center',
		lineHeight: 20,
		fontWeight: '500'
	},
	modalFooter: {
		borderTopWidth: 0.5,
		borderTopColor: Theme.tintGray,
		flexDirection: 'row'
	},
	operation: {
		paddingVertical: 15,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	operationText: {
		fontSize: 15,
		fontWeight: '400',
		color: Theme.grey
	}
});

export default UpdateOverlay;
