/*
 * @Author: Gaoxuan
 * @Date:   2019-05-05 17:25:45
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
import { app } from 'store';

class Report extends Component {
	constructor(props) {
		super(props);
		this.onCheck = this.onCheck.bind(this);
		this.state = {
			content: '',
			type: '侮辱谩骂',
			submitting: false,
			pictures: []
		};
	}

	submitError = async () => {
		const { navigation } = this.props;
		const { user } = navigation.state.params;
		let { content, type, submitting } = this.state;
		let result = {};
		this.setState({
			submitting: !submitting
		});
		content = content.trim();
		try {
			result = await this.props.report({
				variables: {
					report_id: user.id,
					report_type: 'USER',
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
		let { navigation, login, prop } = this.props;
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
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('侮辱谩骂')}>
								<Radio value={'侮辱谩骂'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>侮辱谩骂</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('垃圾广告')}>
								<Radio value={'垃圾广告'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>垃圾广告</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('恶意审题')}>
								<Radio value={'恶意审题'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>恶意审题</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('色情低俗')}>
								<Radio value={'色情低俗'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>色情低俗</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('政治敏感')}>
								<Radio value={'政治敏感'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>政治敏感</Text>
							</TouchFeedback>
							<TouchFeedback style={styles.row} onPress={() => this.onCheck('恶意出题')}>
								<Radio value={'恶意出题'} type={type} onCheck={this.onCheck} />
								<Text style={styles.text}>恶意出题</Text>
							</TouchFeedback>
						</View>
					</View>
					<View style={styles.body}>
						<CustomTextInput
							style={styles.textInput}
							placeholder={'请描述举报原因'}
							multiline
							underline
							maxLength={140}
							textAlignVertical={'top'}
							onChangeText={this.onChangeText}
							value={content}
						/>
						{/*<View style={{ marginLeft: PxFit(Theme.itemSpace) }}>
							<ImagePickerViewer
								ref={ref => (this._imagePickerViewer = ref)}
								onResponse={images => {
									this.setState({ pictures: images });
								}}
							/>
						</View>*/}
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
		paddingBottom: PxFit(10),
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
