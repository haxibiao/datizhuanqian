import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, Image, Keyboard } from 'react-native';
import { DivisionLine, Button, Iconfont, Screen, Input, Waiting } from '../../components';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { ReplyTaskMutation, TasksQuery, UploadImage } from '../../graphql/task.graphql';
import { graphql, compose, withApollo } from 'react-apollo';

let arry = {};

class SubmitTaskScreen extends Component {
	constructor(props) {
		super(props);
		this.submit = false;
		this.state = {
			content: '',
			pictures: [],
			images: [],
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
				Methods.toast('最多选择6张图片', -50);
			} else {
				this.setState({
					pictures
				});
			}
		}, true);
	};

	//先上传图片，等返回图片地址后再提交
	startUploadImage = async () => {
		let { pictures, waitingVisible } = this.state;
		let { client } = this.props;

		Keyboard.dismiss(); //关闭键盘
		this.submit = true; //禁止点击
		this.setState({
			waitingVisible: true
		});
		//等待提示

		let promises = [
			client.mutate({
				mutation: UploadImage,
				variables: {
					image: pictures
				}
			}),
			new Promise(function(resolve, reject) {
				setTimeout(() => reject(new Error('网络超时')), 30000);
			})
		];
		//超时检测

		Promise.race(promises)
			.then(result => {
				this.submitTask(result.data.uploadImage);
			})
			.catch(rejected => {
				this.setState({
					waitingVisible: false
				});
				this.submit = false;
				let str = rejected.toString().replace(/Error: GraphQL error: /, '');
				Methods.toast(str, -100);
			});
	};

	//提交任务
	async submitTask(images) {
		const { navigation } = this.props;
		const { task_id, again } = navigation.state.params;
		let { pictures, waitingVisible } = this.state;
		let result = {};

		arry['screenshots'] = images;
		try {
			result = await this.props.ReplyTaskMutation({
				variables: {
					task_id: task_id,
					content: arry
				},
				refetchQueries: () => [
					{
						query: TasksQuery
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			this.submit = false;
			this.setState({
				waitingVisible: false
			});
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100);
		} else {
			this.submit = false;
			this.setState({
				waitingVisible: false
			});
			Methods.toast('提交成功,工作人员会尽快审核您的答复信息', -100);
			if (again) {
				this.props.navigation.pop(2);
			} else {
				this.props.navigation.goBack();
			}
		}
	}
	render() {
		let { content, pictures, waitingVisible } = this.state;
		const { navigation } = this.props;
		return (
			<Screen>
				<ScrollView style={styles.container}>
					<DivisionLine height={5} />
					<View style={styles.header}>
						<View style={styles.headerLeft} />
						<Text style={styles.headerContent}>小米应用商店评论</Text>
					</View>
					<Input
						customStyle={styles.input}
						maxLength={400}
						placeholder={'文字说明'}
						multiline
						underline
						textAlignVertical={'top'}
						changeValue={value => {
							this.setState({
								content: value
							});
							arry['content'] = content;
						}}
					/>
					<View style={styles.main}>
						<View style={styles.center}>
							<Text style={{ fontSize: 16, color: Colors.primaryFont }}>上传截图</Text>
							<Text style={{ fontSize: 15, color: Colors.grey }}>（{pictures.length}/6）</Text>
						</View>
						<View style={styles.images}>
							{pictures.map((image, index) => {
								return (
									<View key={index}>
										<Image source={{ uri: image }} style={styles.image} />
										<TouchableOpacity
											style={styles.delete}
											onPress={() => {
												pictures.splice(index, 1);
												this.setState({
													pictures
												});
											}}
										>
											<Iconfont name={'close'} size={12} color={Colors.white} />
										</TouchableOpacity>
									</View>
								);
							})}

							{!(pictures.length > 5) && (
								<TouchableOpacity style={styles.add} onPress={this.openPhotos}>
									<Iconfont name={'add'} size={26} color={Colors.tintGray} />
								</TouchableOpacity>
							)}
						</View>
						<View style={styles.mainBottom} />
					</View>

					<Button
						name={'提交'}
						style={styles.button}
						theme={pictures.length > 0 ? Colors.theme : Colors.tintGray}
						textColor={pictures.length > 0 ? Colors.white : Colors.grey}
						handler={this.startUploadImage}
						//提交的时候再上传图片
					/>
				</ScrollView>
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 20
	},
	headerLeft: {
		height: 22,
		width: 10,
		backgroundColor: Colors.theme,
		marginRight: 15
	},
	headerContent: {
		color: Colors.primaryFont,
		fontSize: 16
	},
	main: {
		paddingVertical: 15,
		marginBottom: 30
	},
	center: {
		marginHorizontal: 25,
		paddingBottom: 30,
		flexDirection: 'row',
		alignItems: 'center'
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
		height: 80,
		justifyContent: 'flex-start',
		marginRight: 15
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
		marginTop: 30
	},
	button: {
		height: 42,
		marginHorizontal: 20,
		marginBottom: 20
	}
});

export default compose(graphql(ReplyTaskMutation, { name: 'ReplyTaskMutation' }))(withApollo(SubmitTaskScreen));
