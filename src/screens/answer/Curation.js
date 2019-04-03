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
import { Button, Radio, PageContainer, CustomTextInput, SubmitLoading } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';
import { connect } from 'react-redux';
import { createCurationMutation } from '../../assets/graphql/question.graphql';
import { graphql, compose } from 'react-apollo';

class ErrorCorrectionScreen extends Component {
	constructor(props) {
		super(props);
		this.onCheck = this.onCheck.bind(this);
		this.keyboardDidShowListener = null;
		this.keyboardDidHideListener = null;
		this.state = {
			content: '',
			type: 1,
			inputHeight: PxFit(220),
			isVisible: false
		};
	}

	componentWillMount() {
		//监听键盘弹出事件
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShowHandler.bind(this));
		//监听键盘隐藏事件
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHideHandler.bind(this));
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	keyboardDidShowHandler(event) {
		this.setState({ inputHeight: PxFit(140) });
	}

	//键盘隐藏事件响应
	keyboardDidHideHandler(event) {
		this.setState({ inputHeight: PxFit(220) });
	}

	submitError = async () => {
		const { navigation } = this.props;
		const { question } = navigation.state.params;
		let { content, type, isVisible } = this.state;
		let result = {};
		this.setState({
			isVisible: !isVisible
		});
		try {
			result = await this.props.createCurationMutation({
				variables: {
					question_id: question.id,
					type,
					content
				}
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			this.setState({
				isVisible: false
			});
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
		} else {
			this.setState({
				isVisible: false
			});
			Toast.show({ content: '提交成功' });
			navigation.goBack();
		}
	};

	render() {
		let { user, navigation, login, prop } = this.props;
		let { content, type } = this.state;
		return (
			<PageContainer title="题目纠错" white>
				<ScrollView
					style={styles.container}
					ref={ref => (this.ScrollTo = ref)}
					keyboardShouldPersistTaps={'always'}
				>
					<View style={styles.header}>
						<Text style={styles.type}>错误类型</Text>
						<View style={styles.radios}>
							<View style={styles.row}>
								<Radio value={1} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>题干有误</Text>
							</View>
							<View style={styles.row}>
								<Radio value={2} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>答案有误</Text>
							</View>
							<View style={styles.row}>
								<Radio value={3} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>图片缺少或不清晰</Text>
							</View>
							<View style={styles.row}>
								<Radio value={4} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>其他</Text>
							</View>
						</View>
					</View>
					<View style={styles.footer}>
						<View style={styles.inputWrap}>
							<CustomTextInput
								style={{
									minHeight: this.state.inputHeight,
									height: null,
									fontSize: PxFit(15),
									paddingHorizontal: PxFit(15),
									backgroundColor: 'transparent',
									justifyContent: 'flex-start'
								}}
								placeholder={'您的耐心指点,是我们前进的动力！'}
								multiline
								underline
								maxLength={140}
								textAlignVertical={'top'}
								onChangeText={value => {
									this.setState({
										content: value
									});
								}}
							/>
						</View>
						<Button title={'提交'} style={styles.button} disabled={!content} onPress={this.submitError} />
					</View>
				</ScrollView>
				<SubmitLoading isVisible={this.state.isVisible} content={'提交中...'} />
			</PageContainer>
		);
	}

	onCheck(value) {
		this.setState({ type: value });
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.lightGray
	},
	header: {
		paddingHorizontal: PxFit(15),
		backgroundColor: Theme.white
	},
	type: {
		fontSize: PxFit(17),
		paddingTop: PxFit(25)
	},
	radios: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingVertical: PxFit(10)
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		width: (SCREEN_WIDTH - PxFit(30)) / 2,
		paddingVertical: PxFit(10)
	},
	text: {
		fontSize: PxFit(15),
		paddingLeft: PxFit(20)
	},
	footer: {
		flex: 1,
		marginBottom: PxFit(20)
	},
	inputWrap: {
		backgroundColor: Theme.white,
		paddingVertical: PxFit(10),
		marginTop: PxFit(15)
	},
	button: {
		height: PxFit(42),
		marginHorizontal: PxFit(20),
		marginTop: PxFit(15),
		backgroundColor: Theme.primaryColor
	}
});

export default connect(store => {
	return { user: store.users.user };
})(compose(graphql(createCurationMutation, { name: 'createCurationMutation' }))(ErrorCorrectionScreen));
