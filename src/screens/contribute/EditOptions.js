/*
 * @flow
 * created by wyk made in 2019-06-04 17:20:26
 */
'use strict';
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, CustomTextInput, KeyboardSpacer } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools } from 'utils';
import OptionItem from './components/OptionItem';

const maxLength = 80;

type answer = [string];
type option = { [string]: boolean };
type Props = {
	answers: answer,
	options: option
};

class EditOptions extends Component<Props> {
	constructor(props) {
		super(props);
		let { answers, options, callBack } = props.navigation.state.params;
		this.callBack = callBack;
		this.state = {
			optionValue: '',
			answers,
			options
		};
	}

	goBack = () => {
		let { answers, options } = this.state;
		this.callBack({ answers, options });
		this.props.navigation.goBack();
	};

	optionValidate(optionValue) {
		let character = optionValue
			.trim()
			.split('')
			.join('')
			.toLowerCase();
		if (/[\u4e00-\u9fa5]/.test(optionValue)) {
			console.log(optionValue);
			if (/[a-d]/.test(character[0]) && !/[\u4e00-\u9fa5]|[a-z]/.test(character[1])) {
				if (/[《]/.test(character[1])) {
					optionValue = optionValue.substring(1);
				} else {
					optionValue = optionValue.substring(2);
				}
			}
		}
		return optionValue.trim();
	}

	reduceAnswer = option => {
		let { options, answers } = this.state;
		console.log('option', option);
		console.log('options', options);
		if (option) {
			if (answers.has(option)) {
				console.log('answers');
				answers.delete(option);
				options.set(option, false);
			} else {
				if (options.size === 2 && answers.size === 1) {
					Toast.show({
						content: '两个选项不能全为正确答案'
					});
					return;
				}
				answers.add(option);
				options.set(option, true);
			}
		} else {
			answers.clear();
			options.forEach((value, key) => {
				if (value === true) {
					answers.add(key);
				}
			});
		}
		this.setState({
			answers,
			options
		});
	};

	addOption = () => {
		let { optionValue, options } = this.state;
		if (optionValue.trim().length > 0 && !options.has(optionValue)) {
			options.set(this.optionValidate(optionValue), false);
			this.setState({
				options
			});
		}
		this.setState({
			optionValue: ''
		});
		Keyboard.dismiss();
	};

	removeOption = option => {
		let { options } = this.state;
		options.delete(option);
		this.setState(
			{
				options
			},
			() => {
				this.reduceAnswer();
			}
		);
	};

	renderOptions() {
		let { options } = this.state;
		return (
			<View style={styles.optionsWrap}>
				<View style={styles.optionsTitle}>
					<Text style={{ fontSize: PxFit(15), color: Theme.correctColor }}>正确选项</Text>
					<Text style={{ fontSize: PxFit(15), color: Theme.subTextColor }}>删除</Text>
				</View>
				{[...options].map((option, index) => {
					return (
						<OptionItem
							key={index}
							option={option}
							reduceAnswer={this.reduceAnswer}
							remove={this.removeOption}
						/>
					);
				})}
			</View>
		);
	}

	render() {
		let { options, optionValue } = this.state;
		let { navigation } = this.props;
		let disableAddButton = options.size >= 4 || !optionValue;

		return (
			<PageContainer
				white
				title="答案选项"
				rightView={
					<TouchFeedback style={styles.saveButton} onPress={this.goBack}>
						<Text style={styles.saveText}> 完成 </Text>
					</TouchFeedback>
				}
			>
				<ScrollView style={styles.container}>
					<View style={styles.inputContainer}>
						<CustomTextInput
							style={styles.optionInput}
							value={optionValue}
							multiline
							maxLength={maxLength}
							textAlignVertical="top"
							onChangeText={text =>
								this.setState({
									optionValue: text
								})
							}
							onFocus={() => (this.optionInput = true)}
							onBlur={() => (this.optionInput = false)}
							placeholder="请填写答案选项(2~4个)"
						/>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<View>
								<Text>
									{optionValue.length}/{maxLength}
								</Text>
							</View>

							<TouchableOpacity
								disabled={disableAddButton}
								style={[
									styles.selectionButton,
									!disableAddButton && {
										backgroundColor: Theme.primaryColor
									}
								]}
								onPress={this.addOption}
							>
								<Text style={styles.addText}> 添 加 </Text>
							</TouchableOpacity>
						</View>
					</View>
					<View>{this.renderOptions()}</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	saveButton: {
		flex: 1,
		justifyContent: 'center'
	},
	saveText: {
		fontSize: PxFit(15),
		textAlign: 'center',
		color: Theme.primaryColor
	},
	inputContainer: {
		margin: PxFit(Theme.itemSpace),
		padding: PxFit(10),
		borderRadius: PxFit(4),
		borderWidth: PxFit(1),
		borderColor: Theme.borderColor
	},
	optionInput: {
		height: PxFit(100),
		alignSelf: 'stretch',
		justifyContent: 'center',
		marginRight: PxFit(15)
	},
	selectionButton: {
		width: PxFit(60),
		borderRadius: PxFit(30),
		height: PxFit(30),
		backgroundColor: '#A0A0A0',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addText: {
		fontSize: PxFit(15),
		color: '#fff'
	},
	optionsWrap: {
		margin: PxFit(Theme.itemSpace)
	},
	optionsTitle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default EditOptions;
