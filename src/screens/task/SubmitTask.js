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
			<PageContainer title="提交任务" white>
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
							<Text style={{ fontSize: PxFit(16), color: Theme.primaryFont }}>上传截图</Text>
							<Text style={{ fontSize: PxFit(15), color: Theme.grey }}>（{pictures.length}/6）</Text>
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
							title={<Text style={{ color: Theme.white, fontSize: PxFit(15) }}>提交</Text>}
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
		paddingVertical: PxFit(20),
		borderTopColor: Theme.lightBorder,
		borderTopWidth: PxFit(5)
	},
	headerLeft: {
		height: PxFit(22),
		width: PxFit(10),
		backgroundColor: Theme.theme,
		marginRight: PxFit(15)
	},
	headerContent: {
		color: Theme.primaryFont,
		fontSize: PxFit(16)
	},
	main: {
		paddingVertical: PxFit(15),
		marginBottom: PxFit(30)
	},
	center: {
		marginHorizontal: PxFit(25),
		paddingBottom: PxFit(30),
		flexDirection: 'row',
		alignItems: 'center'
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
		height: PxFit(80),
		justifyContent: 'flex-start',
		marginHorizontal: PxFit(25)
		// marginTop:10,
	},
	add: {
		width: (SCREEN_WIDTH - PxFit(60)) / 3,
		height: (SCREEN_WIDTH - PxFit(60)) / 3,
		borderColor: Theme.lightBorder,
		borderWidth: PxFit(1),
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: (SCREEN_WIDTH - PxFit(60)) / 3,
		height: (SCREEN_WIDTH - PxFit(60)) / 3,
		marginRight: PxFit(5),
		marginBottom: PxFit(5)
	},
	delete: {
		backgroundColor: 'rgba(150,150,150,0.5)',
		borderRadius: PxFit(8),
		position: 'absolute',
		right: PxFit(8),
		top: PxFit(2),
		width: PxFit(16),
		height: PxFit(16),
		justifyContent: 'center',
		alignItems: 'center'
	},
	mainBottom: {
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.lightBorder,
		marginRight: PxFit(15),
		marginTop: PxFit(30)
	},
	button: {
		height: PxFit(42),
		marginBottom: PxFit(20),
		borderRadius: PxFit(19),
		backgroundColor: Theme.theme,
		maxWidth: SCREEN_WIDTH - PxFit(50)
	}
});

export default compose(graphql(ReplyTaskMutation, { name: 'ReplyTaskMutation' }))(withApollo(SubmitTaskScreen));
