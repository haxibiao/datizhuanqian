/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 10:58:29
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	FlatList,
	Image,
	TextInput,
	ScrollView,
	Keyboard
} from 'react-native';
import { Button, Radio, PageContainer, TouchFeedback, CustomTextInput, ImagePickerViewer } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

import { graphql, compose, GQL } from 'apollo';

class Report extends Component {
	constructor(props) {
		super(props);
		this.onCheck = this.onCheck.bind(this);
		this.state = {
			content: '',
			type: '题目重复',
			submitting: false
		};
	}

	submitError = async () => {
		const { navigation } = this.props;
		const { question } = navigation.state.params;
		let { content, type, submitting } = this.state;
		let result = {};
		this.setState({
			submitting: !submitting
		});
		content = content.trim();
		try {
			result = await this.props.report({
				variables: {
					report_id: question.id,
					report_type: 'QUESTION',
					reason: content || type
				}
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			this.setState({
				submitting: false
			});
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
		} else {
			this.setState({
				submitting: false
			});
			Toast.show({ content: '提交成功' });
			navigation.goBack();
		}
	};

	onCheck(value) {
		this.setState({ type: value });
	}

	onChangeText = value => {
		this.setState({
			content: value
		});
	};

	render() {
		let { navigation } = this.props;
		let { content, type, submitting } = this.state;
		return (
			<PageContainer
				white
				title="举报"
				submitting={submitting}
				rightView={
					<TouchFeedback style={styles.saveButton} onPress={this.submitError}>
						<Text style={styles.saveText}>提交</Text>
					</TouchFeedback>
				}
			>
				<ScrollView
					style={styles.container}
					ref={ref => (this.ScrollTo = ref)}
					keyboardShouldPersistTaps={'always'}
				>
					<View style={styles.errorTypes}>
						<View style={styles.radios}>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('题目重复')}>
								<Radio value={'题目重复'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>题目重复</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('分类错误')}>
								<Radio value={'分类错误'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>分类错误</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('描述不清')}>
								<Radio value={'描述不清'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>描述不清</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('低质量内容')}>
								<Radio value={'低质量内容'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>低质量内容</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('题目有误')}>
								<Radio value={'题目有误'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>题目有误</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('垃圾广告')}>
								<Radio value={'垃圾广告'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>垃圾广告</Text>
							</TouchFeedback>
						</View>
					</View>
					<View style={styles.body}>
						<CustomTextInput
							style={styles.textInput}
							placeholder={'您的耐心指点,是我们前进的动力！'}
							multiline
							underline
							maxLength={140}
							textAlignVertical={'top'}
							onChangeText={this.onChangeText}
							value={content}
						/>
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
	saveButton: {
		flex: 1,
		justifyContent: 'center'
	},
	saveText: { fontSize: PxFit(15), textAlign: 'center', color: Theme.secondaryColor },
	errorTypes: {
		backgroundColor: Theme.white
	},
	type: {
		marginTop: PxFit(Theme.itemSpace),
		fontSize: PxFit(17),
		color: Theme.defaultTextColor
	},
	radios: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingVertical: PxFit(10)
	},
	row: {
		paddingHorizontal: PxFit(Theme.itemSpace),
		width: SCREEN_WIDTH / 2,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: PxFit(10)
	},
	text: {
		fontSize: PxFit(15),
		paddingLeft: PxFit(20)
	},
	body: {
		flex: 1,
		marginTop: PxFit(10),
		backgroundColor: '#fff'
	},
	textInput: {
		marginTop: PxFit(15),
		height: PxFit(150),
		fontSize: PxFit(15),
		padding: PxFit(15),
		justifyContent: 'flex-start'
	}
});

export default compose(graphql(GQL.reportMutation, { name: 'report' }))(Report);
