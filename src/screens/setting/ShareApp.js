/*
 * @flow
 * created by wyk made in 2019-03-21 14:13:04
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from '../../utils';

class ShareApp extends Component {
	render() {
		return (
			<PageContainer title='分享给朋友' white>
				<View style={styles.container}>
					<Image
						source={{ uri: 'https://datizhuanqian.com/picture/qrcode.png' }}
						style={{ width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3 }}
					/>
					<Text style={styles.text}>扫描下载{Config.AppName}APP</Text>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		color: Theme.defaultTextColor,
		fontSize: PxFit(15),
		marginTop: PxFit(10)
	}
});

export default ShareApp;
