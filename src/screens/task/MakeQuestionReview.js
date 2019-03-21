/*
 * @flow
 * created by wyk made in 2019-03-13 10:17:11
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { PageContainer, Iconfont, Button } from '../../components';
import { Theme } from '../../utils';

class QuestionReviewScreen extends Component {
	render() {
		let { navigation } = this.props;
		return (
			<PageContainer title="提交结果">
				<ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
					<View style={styles.submitContainer}>
						<ImageBackground
							source={require('../../../assets/images/submit.png')}
							style={styles.submitImage}
						>
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
								<Text style={{ fontSize: 16, color: Theme.theme }}>继续出题</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={() => navigation.replace('我的出题')}>
								<Text style={{ fontSize: 16, color: '#fff' }}>查看题目</Text>
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
		paddingVertical: 30
	},
	submitImage: {
		width: Divice.width * 0.52,
		height: Divice.width * 0.65,
		resizeMode: 'contain',
		paddingTop: Divice.width * 0.07,
		paddingHorizontal: Divice.width * 0.055
	},
	submitStatus: {
		fontSize: 17,
		color: '#212121',
		fontWeight: '500',
		marginBottom: 15
	},
	submitTip: {
		fontSize: 14,
		color: '#969696',
		lineHeight: 18
	},
	buttonContaiber: {
		marginTop: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		width: 100,
		height: 36,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Theme.theme
	},
	buttonBorder: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: Theme.theme,
		marginRight: 20
	}
});

export default QuestionReviewScreen;
