/*
 * @flow
 * created by wyk made in 2019-03-25 10:52:46
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { Theme, PxFit, Config, SCREEN_WIDTH } from '../../utils';

import PageContainer from '../Container/PageContainer';
import Iconfont from '../Iconfont';
import Player from '../Utils/Player';
import OptionItem from './OptionItem';

class QuestionDetail extends Component {
	render() {
		let { navigation } = this.props;
		let { description, image, selections_array, category, answer, video } = navigation.getParam('question', {});
		return (
			<PageContainer title="题目详情">
				<ScrollView
					style={styles.container}
					contentContainerStyle={{ flexGrow: 1, paddingBottom: Theme.HOME_INDICATOR_HEIGHT }}
				>
					<View>
						<View style={{ justifyContent: 'center', paddingHorizontal: PxFit(20) }}>
							<View style={{ marginVertical: PxFit(20) }}>
								<Text style={styles.description}>
									<Text style={styles.subject}>{'题干:  '}</Text>
									{description}
								</Text>
							</View>
							{image && (
								<Image
									source={{
										uri: image.path
									}}
									style={{
										width: SCREEN_WIDTH - 40,
										height: (image.height / image.width) * (SCREEN_WIDTH - 40),
										borderRadius: 5
									}}
								/>
							)}
							{video && <Player source={video.path} />}
						</View>
						<View style={styles.options}>
							{selections_array.map((option, index) => {
								return (
									<OptionItem
										key={index}
										style={{ paddingVertical: PxFit(Theme.itemSpace) }}
										option={option}
										isAnswer={answer && answer.includes(option.Value)}
									/>
								);
							})}
						</View>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	subject: {
		color: Theme.correctColor,
		fontSize: PxFit(16),
		lineHeight: PxFit(22),
		fontWeight: '500'
	},
	description: {
		color: Theme.defaultTextColor,
		fontSize: PxFit(16),
		lineHeight: PxFit(22)
	},
	options: {
		marginTop: PxFit(Theme.itemSpace),
		paddingHorizontal: PxFit(Theme.itemSpace)
	}
});

export default QuestionDetail;
