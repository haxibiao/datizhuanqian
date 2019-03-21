/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:14:13
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, Image, Keyboard } from 'react-native';
import { Button, Iconfont, PageContainer, CustomTextInput, KeyboardSpacer, SubmitLoading } from '../../components';

import { Theme, PxFit, SCREEN_WIDTH, Api } from '../../utils';

import { ReplyTaskMutation, TasksQuery, UploadImage } from '../../assets/graphql/task.graphql';
import { graphql, compose, withApollo } from 'react-apollo';

let arry = {};

class SubmitTaskScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: null,
			pictures: [],
			images: [],
			isVisible: false
		};
	}

	//打开相册
	openPhotos = () => {
		Api.imagePicker(
			images => {
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
			},
			{ includeBase64: true }
		);
	};

	//上传图片
	startUploadImage = async () => {
		let { pictures, isVisible } = this.state;
		let { client } = this.props;

		Keyboard.dismiss();
		this.setState({
			isVisible: true
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
					isVisible: false
				});

				let str = rejected.toString().replace(/Error: GraphQL error: /, '');
				Methods.toast(str, -100);
			});
	};

	//提交任务
	async submitTask(images) {
		const { navigation } = this.props;
		const { task_id, again } = navigation.state.params;
		let { pictures, isVisible } = this.state;
		let result = {};

		arry['screenshots'] = images;
		try {
			result = await this.props.ReplyTaskMutation({
				variables: {
					task_id: task_id,
					content: arry
				},
				errorPolicy: 'all',
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
			this.setState({
				isVisible: false
			});
			let str = result.errors[0].message;
			Toast.show({ content: str });
		} else {
			this.setState({
				isVisible: false
			});
			Toast.show({ content: '提交成功,工作人员会尽快审核您的答复信息' });

			if (again) {
				this.props.navigation.pop(2);
			} else {
				this.props.navigation.goBack();
			}
		}
	}
	render() {
		let { content, pictures, isVisible } = this.state;
		const { navigation } = this.props;
		return (
			<PageContainer
				title="提交任务"
				navBarStyle={{ backgroundColor: Theme.white }}
				titleStyle={{ color: Theme.black }}
				leftView={
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => {
							navigation.goBack();
						}}
					>
						<Iconfont name="left" color={Theme.black} size={PxFit(21)} />
					</TouchableOpacity>
				}
			>
				<ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
					<View style={styles.header}>
						<View style={styles.headerLeft} />
						<Text style={styles.headerContent}>小米应用商店评论</Text>
					</View>
					<CustomTextInput
						style={styles.input}
						maxLength={140}
						placeholder={'文字说明'}
						multiline
						underline
						textAlignVertical={'top'}
						onChangeText={value => {
							this.setState({
								content: value
							});
							arry['content'] = content;
						}}
					/>
					<View style={styles.main}>
						<View style={styles.center}>
							<Text style={{ fontSize: 16, color: Theme.primaryFont }}>上传截图</Text>
							<Text style={{ fontSize: 15, color: Theme.grey }}>（{pictures.length}/6）</Text>
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
											<Iconfont name={'close'} size={12} color={Theme.white} />
										</TouchableOpacity>
									</View>
								);
							})}

							{!(pictures.length > 5) && (
								<TouchableOpacity style={styles.add} onPress={this.openPhotos}>
									<Iconfont name={'add'} size={26} color={Theme.tintGray} />
								</TouchableOpacity>
							)}
						</View>
						<View style={styles.mainBottom} />
					</View>
					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<Button
							title={<Text style={{ color: Theme.white, fontSize: 15 }}>提交</Text>}
							style={styles.button}
							onPress={this.startUploadImage}
							disabled={!(pictures.length > 0 && content)}
							// disabled={!(pictures.length > 0 && content)}
							//提交的时候再上传图片
						/>
					</View>
				</ScrollView>
				<SubmitLoading isVisible={isVisible} content={'提交中...'} />
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.white
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 20,
		borderTopColor: Theme.lightBorder,
		borderTopWidth: 5
	},
	headerLeft: {
		height: 22,
		width: 10,
		backgroundColor: Theme.theme,
		marginRight: 15
	},
	headerContent: {
		color: Theme.primaryFont,
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
		marginHorizontal: 25
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
		borderBottomColor: Theme.lightBorder,
		marginRight: 15,
		marginTop: 30
	},
	button: {
		height: 42,
		marginBottom: 20,
		borderRadius: 19,
		backgroundColor: Theme.theme,
		maxWidth: SCREEN_WIDTH - 50
	}
});

export default compose(graphql(ReplyTaskMutation, { name: 'ReplyTaskMutation' }))(withApollo(SubmitTaskScreen));
