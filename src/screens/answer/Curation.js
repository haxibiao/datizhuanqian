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
import { Button, Radio, PageContainer, TouchFeedback, CustomTextInput, ImagePickerViewer } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';
import { connect } from 'react-redux';
import { createCurationMutation } from '../../assets/graphql/question.graphql';
import { graphql, compose } from 'react-apollo';

class ErrorCorrectionScreen extends Component {
	constructor(props) {
		super(props);
		this.onCheck = this.onCheck.bind(this);
		this.images = null;
		this.state = {
			content: '',
			type: 1,
			submitting: false
		};
	}

	submitError = async () => {
		const { navigation } = this.props;
		const { question } = navigation.state.params;
		let { content, type, images, submitting } = this.state;
		let result = {};
		this.setState({
			submitting: !submitting
		});
		content = content.trim();
		try {
			result = await this.props.createCurationMutation({
				variables: {
					question_id: question.id,
					type,
					content,
					images: this.images
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
		let { user, navigation, login, prop } = this.props;
		let { content, type, submitting } = this.state;
		let disabled = !content.trim();
		return (
			<PageContainer
				white
				title="题目纠错"
				submitting={submitting}
				rightView={
					<TouchFeedback
						disabled={disabled}
						style={[styles.saveButton, disabled && { opacity: 0.5 }]}
						onPress={this.submitError}
					>
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
						<Text style={styles.type}>错误类型</Text>
						<View style={styles.radios}>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck(1)}>
								<Radio value={1} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>题干有误</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck(2)}>
								<Radio value={2} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>答案有误</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck(3)}>
								<Radio value={3} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>图片缺少或不清晰</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck(4)}>
								<Radio value={4} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>其他</Text>
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
						<View style={{ padding: PxFit(Theme.itemSpace) }}>
							<ImagePickerViewer
								maximum={3}
								onResponse={images => {
									this.images = images;
								}}
							/>
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
	saveButton: {
		flex: 1,
		justifyContent: 'center'
	},
	saveText: { fontSize: PxFit(15), textAlign: 'center', color: Theme.secondaryColor },
	errorTypes: {
		paddingHorizontal: PxFit(Theme.itemSpace),
		backgroundColor: Theme.white
	},
	type: {
		marginTop: PxFit(Theme.itemSpace),
		fontSize: PxFit(17),
		color: Theme.defaultTextColor
	},
	radios: {
		paddingVertical: PxFit(10)
	},
	row: {
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
		marginTop: PxFit(15),
		backgroundColor: '#fff'
	},
	textInput: {
		marginTop: PxFit(15),
		height: PxFit(120),
		fontSize: PxFit(15),
		padding: PxFit(15),
		justifyContent: 'flex-start'
	}
});

export default connect(store => {
	return { user: store.users.user };
})(compose(graphql(createCurationMutation, { name: 'createCurationMutation' }))(ErrorCorrectionScreen));
