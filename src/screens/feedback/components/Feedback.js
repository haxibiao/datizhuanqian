/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 13:18:57
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Button, Iconfont, PageContainer, CustomTextInput, SubmitLoading, KeyboardSpacer } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

import { CreateFeedbackMutation } from '../../../assets/graphql/feedback.graphql';
import { Mutation, graphql, compose, withApollo } from 'react-apollo';

import ImagePickerView from './ImagePickerView';

class Feedback extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: '',
			pictures: [],
			titile: '',
			waitingVisible: false
		};
	}

	submitFeedback = async () => {
		const { navigation, client } = this.props;
		let { title, pictures, content, waitingVisible } = this.state;
		let result = {};
		this.setState({
			waitingVisible: true
		});

		let promises = [
			client.mutate({
				mutation: CreateFeedbackMutation,
				variables: {
					title: title,
					content: content,
					images: pictures
				}
			}),
			new Promise(function(resolve, reject) {
				setTimeout(() => reject(new Error('网络超时')), 30000);
			})
		];
		//超时检测

		Promise.race(promises)
			.then(result => {
				this.setState({
					waitingVisible: false
				});
				Toast.show({ content: '反馈成功' });
				navigation.navigate('反馈详情', {
					feedback_id: result.data.createFeedback.id
				});
				this.setState({
					pictures: [],
					content: ''
				});
			})
			.catch(rejected => {
				this.setState({
					waitingVisible: false
				});
				let str = rejected.toString().replace(/Error: GraphQL error: /, '');
				Toast.show({ content: str });
			});
	};

	render() {
		let { content, pictures, waitingVisible } = this.state;
		const { navigation } = this.props;

		return (
			<PageContainer hiddenNavBar tabLabel="意见反馈">
				<ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
					{/*					<DivisionLine height={5} />*/}
					<View style={styles.main}>
						<CustomTextInput
							style={styles.input}
							maxLength={140}
							placeholder={'请简要描述您的问题和意见,我们将为您不断改进'}
							multiline
							underline
							textAlignVertical={'top'}
							defaultValue={this.state.content}
							onChangeText={value => {
								this.setState({
									content: value
								});
							}}
						/>

						<ImagePickerView
							onResponse={images => {
								this.setState({ pictures: images });
							}}
						/>
						<View style={styles.mainBottom} />
					</View>
					<Button
						title={'提交'}
						style={{ height: 42, marginHorizontal: 20, marginBottom: 20, backgroundColor: Theme.theme }}
						onPress={this.submitFeedback}
						disabled={!content}
					/>
				</ScrollView>
				<SubmitLoading isVisible={waitingVisible} content={'提交反馈中'} />
				<KeyboardSpacer />
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.white
	},
	main: {
		paddingVertical: 15,
		marginBottom: 30,
		borderTopWidth: 5,
		borderTopColor: Theme.lightBorder
	},
	images: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: 25
	},
	input: {
		backgroundColor: 'transparent',
		fontSize: 15,
		padding: 0,
		height: 240,
		paddingHorizontal: 20,
		justifyContent: 'flex-start'
		// marginTop:10,
	},
	add: {
		width: (SCREEN_WIDTH - 60) / 3,
		height: (SCREEN_WIDTH - 60) / 3,
		borderColor: Theme.lightBorder,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (SCREEN_WIDTH - 60) / 3,
		height: (SCREEN_WIDTH - 60) / 3,
		marginRight: 5,
		marginBottom: 5
	},
	mainBottom: {
		borderBottomWidth: 1,
		borderBottomColor: Theme.lightBorder,
		marginRight: 15,
		marginTop: 15
	}
});

export default withApollo(Feedback);
