/*
 * @flow
 * created by wyk made in 2019-03-19 11:28:12
 */
import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import { TouchFeedback, Iconfont, Row, ItemSeparator, PopOverlay } from '../../components';
import { Overlay } from 'teaset';

function CorrectModal(props) {
	PopOverlay({
		title: title ? '恭喜你回答正确' : '很遗憾,回答错误',
		content: (
			<View>
				<Text>1111</Text>
			</View>
		),
		onConfirm: () => null
	});

	// let overlayView = (
	// 	<Overlay.PopView
	// 		style={{ alignItems: 'center', justifyContent: 'center' }}
	// 		animated
	// 		ref={ref => (this.popViewRef = ref)}
	// 	>
	// 		<View style={styles.overlayInner}>
	// 			<CustomTextInput
	// 				style={styles.inputArea}
	// 				onChangeText={text => (this.topicItem = { name: text })}
	// 				autoFocus
	// 				textAlignVertical="top"
	// 				placeholder="添加话题~"
	// 				maxLength={12}
	// 			/>
	// 			<View style={styles.control}>
	// 				<TouchFeedback
	// 					style={styles.cancel}
	// 					onPress={() => {
	// 						this.popViewRef.close();
	// 					}}
	// 				>
	// 					<Text style={styles.cancelText}>取消</Text>
	// 				</TouchFeedback>
	// 				<TouchFeedback
	// 					style={styles.confirm}
	// 					onPress={() => {
	// 						this.addTopic();
	// 					}}
	// 				>
	// 					<Text style={styles.confirmText}>确定</Text>
	// 				</TouchFeedback>
	// 			</View>
	// 		</View>
	// 		{ISIOS && <KeyboardSpace topInsets={-Theme.HOME_INDICATOR_HEIGHT} />}
	// 	</Overlay.PopView>
	// );
	// Overlay.show(overlayView);
}

const styles = StyleSheet.create({
	true: {
		fontSize: 18,
		paddingTop: 15
	},
	false: {
		fontSize: 18,
		paddingTop: 15
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 15
	},
	text: {
		fontSize: 13
	}
});

export default CorrectModal;
