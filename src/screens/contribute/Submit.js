/*
 * @flow
 * created by wyk made in 2019-03-13 10:17:11
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { PageContainer, Iconfont, Button } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

class SubmitSuccess extends Component {
	render() {
		let { navigation } = this.props;
		return (
			<PageContainer title="提交结果">
				<ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
					<View style={styles.submitContainer}>
						<ImageBackground source={require('../../assets/images/submit.png')} style={styles.submitImage}>
							<View style={{ alignItems: 'center' }}>
								<Text style={styles.submitStatus}>提交成功</Text>
								<Text style={styles.submitTip}>工作人员会尽快审核您的题目，请耐心等待哦!</Text>
							</View>
						</ImageBackground>
						<View style={styles.buttonContaiber}>
							<TouchableOpacity
								style={[styles.button, styles.buttonBorder]}
								onPress={() => navigation.replace('问题创建')}
							>
								<Text style={{ fontSize: PxFit(16), color: Theme.theme }}>继续出题</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={() => navigation.replace('我的出题')}>
								<Text style={{ fontSize: PxFit(16), color: '#fff' }}>查看题目</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9f9f9'
	},
	submitContainer: {
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingVertical: PxFit(30)
	},
	submitImage: {
		width: SCREEN_WIDTH * 0.52,
		height: SCREEN_WIDTH * 0.65,
		resizeMode: 'contain',
		paddingTop: SCREEN_WIDTH * 0.07,
		paddingHorizontal: SCREEN_WIDTH * 0.055
	},
	submitStatus: {
		fontSize: PxFit(17),
		color: '#212121',
		fontWeight: '500',
		marginBottom: PxFit(15)
	},
	submitTip: {
		fontSize: PxFit(14),
		color: '#969696',
		lineHeight: PxFit(18)
	},
	buttonContaiber: {
		marginTop: PxFit(30),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		width: PxFit(100),
		height: PxFit(36),
		borderRadius: PxFit(4),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Theme.theme
	},
	buttonBorder: {
		backgroundColor: '#fff',
		borderWidth: PxFit(1),
		borderColor: Theme.theme,
		marginRight: PxFit(20)
	}
});

export default SubmitSuccess;
