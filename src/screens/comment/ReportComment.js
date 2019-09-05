/*
 * @Author: Gaoxuan
 * @Date:   2019-05-07 15:56:31
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

class ReportComment extends Component {
	constructor(props) {
		super(props);
		this.onCheck = this.onCheck.bind(this);
		this.state = {
			content: '',
			type: '辱骂攻击',
			submitting: false
		};
	}

	submitError = async () => {
		const { navigation } = this.props;
		const { comment_id } = navigation.state.params;
		let { content, type, submitting } = this.state;
		let result = {};
		this.setState({
			submitting: !submitting
		});
		content = content.trim();
		try {
			result = await this.props.report({
				variables: {
					report_id: comment_id,
					report_type: 'COMMENT',
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
			Toast.show({ content: '举报成功' });
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
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('辱骂攻击')}>
								<Radio value={'辱骂攻击'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>辱骂攻击</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('垃圾广告')}>
								<Radio value={'垃圾广告'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>垃圾广告</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('低俗色情')}>
								<Radio value={'低俗色情'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>低俗色情</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('政治敏感')}>
								<Radio value={'政治敏感'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>政治敏感</Text>
							</TouchFeedback>
						</View>
					</View>
					<View style={styles.body}>
						<CustomTextInput
							style={styles.textInput}
							placeholder={'共同营造良好的答题环境！'}
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

export default compose(graphql(GQL.reportMutation, { name: 'report' }))(ReportComment);
