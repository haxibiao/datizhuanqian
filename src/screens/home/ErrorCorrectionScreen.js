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
import { Button, Radio, Screen, Input, Header, SubmitLoading } from '../../components';

import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import { createQuestionRedressMutation } from '../../graphql/question.graphql';
import { graphql, compose } from 'react-apollo';
import KeyboardSpacer from 'react-native-keyboard-spacer';

class ErrorCorrectionScreen extends Component {
	constructor(props) {
		super(props);
		this.onCheck = this.onCheck.bind(this);
		this.keyboardDidShowListener = null;
		this.keyboardDidHideListener = null;
		this.state = {
			color: Colors.theme,
			content: '',
			type: 1,
			inputHeight: 220,
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
		this.setState({ inputHeight: 140 });
		console.log(event.endCoordinates.height);
	}

	//键盘隐藏事件响应
	keyboardDidHideHandler(event) {
		this.setState({ inputHeight: 220 });
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
			result = await this.props.createQuestionRedressMutation({
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
			Methods.toast(str, -100);
		} else {
			this.setState({
				isVisible: false
			});
			Methods.toast('提交成功', -100);
			navigation.goBack();
		}
	};

	render() {
		let { user, navigation, login, prop } = this.props;
		let { content, type } = this.state;
		return (
			<Screen>
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
					<View style={{ flex: 1, marginBottom: 20 }}>
						<Input
							viewStyle={{
								paddingHorizontal: 15,
								paddingVertical: 10,
								backgroundColor: Colors.white,
								marginTop: 15
							}}
							customStyle={[styles.input, { minHeight: this.state.inputHeight, height: null }]}
							placeholder={'您的耐心指点,是我们前进的动力！'}
							multiline
							underline
							maxLength={200}
							textAlignVertical={'top'}
							changeValue={value => {
								this.setState({
									content: value
								});
							}}
						/>

						<Button
							name={'提交'}
							style={{ height: 42, marginHorizontal: 20, marginTop: 15 }}
							theme={Colors.theme}
							textColor={content ? Colors.white : Colors.grey}
							disabled={!content}
							disabledColor={Colors.tintGray}
							fontSize={14}
							handler={this.submitError}
						/>
					</View>
				</ScrollView>
				<SubmitLoading isVisible={this.state.isVisible} tips={'提交中...'} />
				<KeyboardSpacer />
			</Screen>
		);
	}

	onCheck(value) {
		this.setState({ type: value });
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGray
	},
	header: {
		paddingHorizontal: 15,
		backgroundColor: Colors.white
	},
	type: {
		fontSize: 17,
		paddingTop: 25
	},
	radios: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingVertical: 10
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		width: (Divice.width - 30) / 2,
		paddingVertical: 10
	},
	text: {
		fontSize: 15,
		paddingLeft: 20
	},
	input: {
		backgroundColor: 'transparent',
		fontSize: 15,
		padding: 0,
		justifyContent: 'flex-start'
		// marginTop:10,
	}
});

export default connect(store => {
	return { user: store.users.user };
})(compose(graphql(createQuestionRedressMutation, { name: 'createQuestionRedressMutation' }))(ErrorCorrectionScreen));
