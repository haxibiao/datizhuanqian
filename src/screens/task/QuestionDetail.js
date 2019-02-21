/*
 * @flow
 * created by wyk made in 2019-02-14 11:24:23
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { DivisionLine, Header, Screen, LoadingError, Iconfont, OptionItem } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

class QuestionDetail extends Component {
	render() {
		let { navigation } = this.props;
		let { description, image, selections, category, answer } = navigation.getParam('question', {});
		selections = selections.replace(/\\/g, '');
		let options = [];
		try {
			options = JSON.parse(selections);
			if (options.Selection) {
				options = options.Selection;
			} else if (options.Section) {
				options = options.Section;
			}
		} catch (error) {
			Methods.toast('数据出错');
			navigation.goBack();
			return <View />;
		}
		return (
			<Screen header>
				<Header
					customStyle={{
						backgroundColor: Colors.theme,
						borderBottomWidth: 0,
						borderBottomColor: 'transparent'
					}}
				/>
				<ScrollView
					style={styles.container}
					contentContainerStyle={{ flexGrow: 1, paddingBottom: Divice.bottom_height }}
				>
					<View>
						<View style={{ justifyContent: 'center', paddingHorizontal: 20 }}>
							<View style={{ marginVertical: 20 }}>
								<Text style={styles.description}>
									<Text style={styles.subject}>{'题目:  '}</Text>
									{description}
								</Text>
							</View>
							{image && (
								<Image
									source={{
										uri: image.path
									}}
									style={{
										width: Divice.width - 40,
										height: (image.height / image.width) * (Divice.width - 40),
										borderRadius: 5
									}}
								/>
							)}
						</View>
						<View style={styles.options}>
							{options.map((option, index) => {
								return (
									<OptionItem
										key={index}
										style={{ paddingVertical: 12 }}
										option={option}
										isAnswer={answer && answer.includes(option.Value)}
									/>
								);
							})}
						</View>
					</View>
				</ScrollView>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	subject: {
		color: Colors.skyBlue,
		fontSize: 16,
		lineHeight: 22,
		fontWeight: '500'
	},
	description: {
		color: Colors.primaryFont,
		fontSize: 16,
		lineHeight: 22
	},
	options: {
		paddingTop: 30,
		paddingHorizontal: 20
	}
});

export default QuestionDetail;
