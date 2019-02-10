import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { DivisionLine, Button, Iconfont, Screen, Input, Waiting, ImagePickerView } from '../../components';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { CreateFeedbackMutation } from '../../graphql/feedback.graphql';
import { Mutation, graphql, compose, withApollo } from 'react-apollo';

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

	//打开相册
	openPhotos = () => {
		Methods.imagePicker(images => {
			let { pictures } = this.state;
			images.map(image => {
				pictures.push(`data:${image.mime};base64,${image.data}`);
			});
			if (pictures.length > 6) {
				this.setState({
					pictures: pictures.slice(0, 6)
				});
				Methods.toast('最大上传不超过6张图片');
			} else {
				this.setState({
					pictures
				});
			}
		});
	};

	submitFeedback = async () => {
		const { navigation, client } = this.props;
		let { title, pictures, content, waitingVisible } = this.state;
		let result = {};
		this.setState({
			waitingVisible: true
		});
		//等待提示
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
				Methods.toast('反馈成功', -180);
				navigation.navigate('反馈详情', {
					feedback: result.data.createFeedback
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
				Methods.toast(str, -100);
			});
	};

	render() {
		let { content, pictures, waitingVisible } = this.state;
		const { navigation } = this.props;

		return (
			<Screen header tabLabel="意见反馈">
				<View style={styles.container}>
					<DivisionLine height={5} />
					<View style={styles.main}>
						<Input
							customStyle={styles.input}
							maxLength={400}
							placeholder={'请简要描述您的问题和意见,我们将为您不断改进'}
							multiline
							underline
							textAlignVertical={'top'}
							defaultValue={this.state.content}
							changeValue={value => {
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
						name={'提交'}
						style={{ height: 42, marginHorizontal: 20, marginBottom: 20 }}
						theme={content ? Colors.theme : Colors.tintGray}
						textColor={content ? Colors.white : Colors.grey}
						handler={this.submitFeedback}
					/>
				</View>
				<Waiting isVisible={waitingVisible} />
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	main: {
		paddingVertical: 15,
		marginBottom: 30
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
		justifyContent: 'flex-start'
		// marginTop:10,
	},
	add: {
		width: (Divice.width - 60) / 3,
		height: (Divice.width - 60) / 3,
		borderColor: Colors.lightBorder,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (Divice.width - 60) / 3,
		height: (Divice.width - 60) / 3,
		marginRight: 5,
		marginBottom: 5
	},
	delete: {
		backgroundColor: 'rgba(150,150,150,0.5)',
		borderRadius: 8,
		position: 'absolute',
		right: 8,
		top: 2,
		width: 16,
		height: 16,
		justifyContent: 'center',
		alignItems: 'center'
	},
	mainBottom: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		marginRight: 15,
		marginTop: 15
	}
});

export default withApollo(Feedback);
