/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 13:18:57
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Button, Iconfont, PageContainer, CustomTextInput, SubmitLoading } from '../../../components';
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
			submitting: false
		};
	}

	submitFeedback = async () => {
		const { navigation, client } = this.props;
		let { title, pictures, content, submitting } = this.state;
		let result = {};
		this.setState({
			submitting: true
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
					submitting: false
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
					submitting: false
				});
				let str = rejected.toString().replace(/Error: GraphQL error: /, '');
				Toast.show({ content: str });
			});
	};

	render() {
		let { content, pictures, submitting } = this.state;
		const { navigation } = this.props;

		return (
			<PageContainer hiddenNavBar tabLabel="意见反馈" submitting={submitting}>
				<ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
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
					<Button title={'提交'} style={styles.button} onPress={this.submitFeedback} disabled={!content} />
				</ScrollView>
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
		paddingVertical: PxFit(15),
		marginBottom: PxFit(30)
	},
	images: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: PxFit(25)
	},
	input: {
		backgroundColor: 'transparent',
		fontSize: PxFit(15),
		padding: 0,
		height: PxFit(240),
		paddingHorizontal: PxFit(20),
		justifyContent: 'flex-start'
		// marginTop:10,
	},
	add: {
		width: (SCREEN_WIDTH - 60) / 3,
		height: (SCREEN_WIDTH - 60) / 3,
		borderColor: Theme.lightBorder,
		borderWidth: PxFit(1),
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (SCREEN_WIDTH - 60) / 3,
		height: (SCREEN_WIDTH - 60) / 3,
		marginRight: PxFit(5),
		marginBottom: PxFit(5)
	},
	mainBottom: {
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.lightBorder,
		marginRight: PxFit(15),
		marginTop: PxFit(15)
	},
	button: {
		height: PxFit(42),
		marginHorizontal: PxFit(20),
		marginBottom: PxFit(20),
		backgroundColor: Theme.primaryColor
	}
});

export default withApollo(Feedback);
