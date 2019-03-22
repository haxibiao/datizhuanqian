/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:33:42
 */

/*
 * @flow
 * created by wyk made in 2019-02-12 10:29:25
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	ScrollView,
	Image,
	Text,
	TouchableOpacity,
	Keyboard,
	Animated,
	BackHandler,
	Platform
} from 'react-native';
import {
	DivisionLine,
	Header,
	Screen,
	LoadingError,
	CustomTextInput,
	DropdownMenu,
	Iconfont,
	AnimationButton,
	OptionItem,
	Select,
	OverlayProgress,
	KeyboardSpacer,
	SubmitLoading
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods, videoUpload, cancelUpload, saveVideo } from '../../helpers';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { createQuestionMutation } from '../../graphql/task.graphql';
import { CategoriesQuery, QuestionQuery } from '../../graphql/question.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import { NavigationEvents } from 'react-navigation';

const ANSWERS = ['A', 'B', 'C', 'D'];

class MakeQuestionScreen extends Component {
	constructor(props) {
		super(props);
		this.categories = [];
		this.dropData = null;
		this.variables = null;
		this.state = {
			uploadId: null,
			progress: 0,
			category_id: null,
			video_id: null,
			description: null,
			picture: null,
			video_path: null,
			optionValue: null,
			answers: new Set(),
			options: new Map(),
			uploading: false,
			submitLoading: false
		};
	}

	//组件初始渲染执行完毕后调用
	componentDidMount() {
		//如果当前是Android系统，则添加back键按下事件监听
		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', () => {
				return this.handleBackAndroid();
			});
		}
	}

	//组件被卸载前会执行
	componentWillUnmount() {
		//如果当前是Android系统，则移除back键按下事件监听
		if (Platform.OS === 'android') {
			BackHandler.removeEventListener('hardwareBackPress', () => {});
		}
	}

	//back键按下事件响应
	handleBackAndroid() {
		// 如果存在上一页则后退;
		if (this.state.uploading) {
			return true; //接管默认行为
		}
		return false; //使用默认行为（直接退出应用）
	}

	onOptionInputFocus = () => {
		this._ScrollView.scrollTo({
			x: 0,
			y: 300,
			animated: true
		});
	};

	buildDropData = data => {
		this.categories = data;
		data = data.map((elem, index) => {
			return elem.name;
		});
		this.dropData = [data];
	};

	addOption = () => {
		let { optionValue, options } = this.state;
		if (optionValue) {
			options.set(optionValue, false);
			this.setState({ options });
		}
		this.setState({ optionValue: null });
		Keyboard.dismiss();
	};

	removeOption = option => {
		let { options } = this.state;
		options.delete(option.Text);
		this.setState({ options }, () => {
			this.reduceAnswer();
		});
	};

	reduceAnswer = option => {
		let { options, answers } = this.state;
		if (option) {
			if (answers.has(option.Value)) {
				answers.delete(option.Value);
				options.set(option.Text, false);
			} else {
				answers.add(option.Value);
				options.set(option.Text, true);
			}
		} else {
			let i = 0;
			answers.clear();
			options.forEach((value, key) => {
				if (value === true) {
					answers.add(ANSWERS[i]);
				}
				i++;
			});
		}
		answers = new Set([...answers].sort());
		this.setState({ answers, options });
	};

	dropHandler = name => {
		this.categories.some((elem, i) => {
			if (elem.name === name) {
				this.setState({ category_id: elem.id });
				return true;
			}
		});
	};

	showSelected = () => {
		this.dialog.show('请选择资源类型', ['图片', '视频'], '#333333', this.callbackSelected);
	};

	callbackSelected = i => {
		switch (i) {
			case 0: // 图库
				this.imagePicke();

				break;
			case 1: // 视频
				this.videoPicker({ gender: 1 });
				break;
		}
	};

	imagePicke = () => {
		ImagePicker.openPicker({
			mediaType: 'photo',
			includeBase64: true
		})
			.then(image => {
				image = `data:${image.mime};base64,${image.data}`;
				this.setState({ picture: image });
			})
			.catch(error => {});
	};

	videoPicker = () => {
		ImagePicker.openPicker({
			multiple: false,
			mediaType: 'video'
		})
			.then(video => {
				let videoPath = video.path.substr(7);
				this.setState({ video_path: video.path });
				videoUpload({
					videoPath,
					onBeforeUpload: metadata => {
						if (metadata.duration > 15) {
							this.setState({ video_path: null });
							Methods.toast('抱歉，视频时长需在15秒以内', 150);
							throw '视频时长需在15秒以内';
						}
					},
					onStarted: uploadId => {
						this.setState({ uploading: true, progress: 0, uploadId });
					},
					onProcess: progress => {
						this.setState({ progress });
					},
					onCancelled: () => {
						console.log('onCancelled');
					},
					onCompleted: async video => {
						if (this.state.uploading) {
							console.log('video', video);
							await saveVideo(this.props.user.token, video, video => {
								this.setState({ progress: 100, video_id: video.id, uploading: false });
							});
						}
					},
					onError: video => this.setState({ progress: 0, uploading: false, video_path: null })
				});
			})
			.catch(err => {
				console.log(err);
			});
	};

	closeMedia = () => {
		if (this.state.video_path) {
			this.setState({ uploadId: null, video_path: null, video_id: null });
		} else {
			this.setState({ picture: null });
		}
	};

	cancelUpload = () => {
		if (this.state.uploading) {
			!Divice.isIos && cancelUpload(this.state.uploadId);
			this.setState({ uploadId: null, video_path: null, progress: 0, uploading: false });
		}
	};

	buildVariables = () => {
		let { video_path, category_id, video_id, description, picture, options, answers } = this.state;
		if (video_path && !video_id) {
			return null;
		}
		let selections = [...options].map((option, index) => {
			if (option) {
				return { Value: ANSWERS[index], Text: option[0] };
			}
		});
		if (category_id && description && selections.length > 1 && answers.size > 0) {
			return {
				data: {
					category_id,
					description,
					selections,
					video_id,
					image: picture,
					answers: [...answers]
				}
			};
		}
	};

	onSubmit = mutate => {
		if (this.variables) {
			this.setState({ submitLoading: true });
			mutate && mutate();
			return;
		}
		Methods.toast('请确保分类/题干/答案填写完整', 150);
	};

	onCompleted = () => {
		this.setState({ submitLoading: false });
		this.props.navigation.replace('出题审核');
	};

	onError = error => {
		console.log(error);
		this.setState({ submitLoading: false });
		Methods.toast('提交出错', 150);
	};

	render() {
		let { navigation, user, login } = this.props;
		let {
			category_id,
			description,
			picture,
			video_path,
			options,
			optionValue,
			answers,
			progress,
			uploading,
			submitLoading
		} = this.state;
		let disableAddButton = options.size >= 4 || !optionValue;
		this.variables = this.buildVariables();
		return (
			<Query query={CategoriesQuery} variables={{ limit: 100 }}>
				{({ data, loading, error }) => {
					if (data && data.categories) {
						this.buildDropData(data.categories);
					} else {
						this.dropData = [['请选择题库']];
					}
					return (
						<Screen header>
							<Header
								customStyle={styles.header}
								headerRight={
									<AnimationButton
										style={styles.submitButton}
										handler={this.onSubmit}
										mutation={createQuestionMutation}
										variables={this.variables}
										onCompleted={this.onCompleted}
										onError={this.onError}
									>
										<Iconfont name="book2" color="#212121" size={17} style={{ marginRight: 4 }} />
										<Text style={{ fontSize: 17, color: '#212121' }}>提交</Text>
									</AnimationButton>
								}
							/>
							<View style={styles.container}>
								<DropdownMenu
									dropStyle={{ paddingHorizontal: 15 }}
									dropItemStyle={{ alignItems: 'flex-end' }}
									lables={['请选择题库']}
									lable={<Text style={styles.lableText}>题目分类</Text>}
									bgColor={'white'}
									tintColor={'#666666'}
									activityTintColor={Colors.theme}
									handler={(selection, row) => this.dropHandler(this.dropData[selection][row])}
									data={this.dropData}
								>
									<ScrollView
										keyboardDismissMode={'none'}
										style={styles.container}
										contentContainerStyle={{
											flexGrow: 1,
											paddingBottom: Divice.bottom_height + 50
										}}
										ref={ref => (this._ScrollView = ref)}
									>
										<DivisionLine />
										<View style={{ marginBottom: 15 }}>
											<CustomTextInput
												style={styles.questionInput}
												onChangeText={text => this.setState({ description: text.trim() })}
												multiline
												maxLength={300}
												textAlignVertical="top"
												placeholder="填写题目题干"
											/>
											<View
												style={{
													marginTop: 10,
													marginHorizontal: 15,
													flexDirection: 'row',
													justifyContent: 'space-between',
													alignItems: 'flex-end'
												}}
											>
												{picture ? (
													<View>
														<Image source={{ uri: picture }} style={styles.addImage} />
														<TouchableOpacity
															style={styles.closeBtn}
															onPress={this.closeMedia}
														>
															<Iconfont name={'close'} size={20} color="#fff" />
														</TouchableOpacity>
													</View>
												) : video_path ? (
													<View>
														<Video
															muted
															source={{ uri: video_path }}
															style={styles.addImage}
															resizeMode="cover"
															repeat
														/>
														<TouchableOpacity
															style={styles.closeBtn}
															onPress={this.closeMedia}
														>
															<Iconfont name={'close'} size={20} color="#fff" />
														</TouchableOpacity>
													</View>
												) : (
													<TouchableOpacity
														style={styles.addImage}
														onPress={this.showSelected}
													>
														<Iconfont name={'add'} size={26} color="#fff" />
													</TouchableOpacity>
												)}
												<TouchableWithoutFeedback
													onPress={() => {
														navigation.navigate('出题规则');
													}}
												>
													<Text style={{ fontSize: 13, color: Colors.grey }}>出题规则</Text>
												</TouchableWithoutFeedback>
											</View>
										</View>
										<DivisionLine />
										<View style={styles.answer}>
											<View style={styles.answers}>
												<Text style={styles.answerText}>正确答案: </Text>
												<Text style={[styles.answerText, { color: Colors.blue }]}>
													{[...answers].join(',')}
												</Text>
											</View>
											<Text style={styles.answerTip}>* 点击选项设置正确答案</Text>
										</View>
										<View>
											<View style={styles.options}>
												{[...options].map((option, index) => {
													return (
														<OptionItem
															key={index}
															style={{ padding: 12 }}
															option={{ Value: ANSWERS[index], Text: option[0] }}
															isAnswer={option[1]}
															reduceAnswer={this.reduceAnswer}
															remove={this.removeOption}
														/>
													);
												})}
											</View>
										</View>
										{!Divice.isIos && <KeyboardSpacer topInsets={-Divice.bottom_height} />}
									</ScrollView>
									<View style={styles.bottom}>
										<View style={styles.inputContainer}>
											<CustomTextInput
												style={styles.optionInput}
												maxLength={80}
												value={optionValue}
												onChangeText={text => this.setState({ optionValue: text.trim() })}
												placeholder="请填写答案选项(2~4个)"
												onFocus={this.onOptionInputFocus}
											/>
											<TouchableOpacity
												disabled={disableAddButton}
												style={[
													styles.button,
													!disableAddButton && { backgroundColor: Colors.skyBlue }
												]}
												onPress={this.addOption}
											>
												<Text style={styles.addText}>添 加</Text>
											</TouchableOpacity>
										</View>
									</View>
									<KeyboardSpacer topInsets={-Divice.bottom_height} />
								</DropdownMenu>
							</View>
							<Select
								ref={dialog => {
									this.dialog = dialog;
								}}
							/>
							<OverlayProgress progress={progress} visible={uploading} cancelUpload={this.cancelUpload} />
							<SubmitLoading isVisible={submitLoading} tips="正在提交" />
						</Screen>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	header: {
		backgroundColor: Colors.theme,
		borderBottomWidth: 0,
		borderBottomColor: 'transparent'
	},
	submitButton: {
		width: 60,
		height: 25,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		alignItems: 'center'
	},
	lableText: {
		fontSize: 14,
		color: '#A0A0A0'
	},
	questionInput: {
		fontSize: 15,
		lineHeight: 20,
		color: '#212121',
		height: 120,
		paddingHorizontal: 15,
		marginTop: 10,
		backgroundColor: '#fff'
	},
	addImage: {
		width: 100,
		height: 100,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center'
	},
	closeBtn: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 20,
		height: 20,
		backgroundColor: 'rgba(0,0,0,0.2)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	answer: {
		padding: 15
	},
	answers: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	answerText: {
		fontSize: 15,
		color: '#A0A0A0'
	},
	answerTip: {
		marginTop: 5,
		fontSize: 12,
		color: Colors.red
	},
	options: {
		paddingHorizontal: 10
	},
	bottom: {
		paddingBottom: Divice.bottom_height,
		backgroundColor: '#f7f7f7'
	},
	inputContainer: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15
	},
	optionInput: {
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		marginRight: 15
	},
	button: {
		width: 50,
		height: 30,
		borderRadius: 5,
		backgroundColor: '#A0A0A0',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addText: {
		fontSize: 14,
		color: '#fff'
	}
});

export default compose(connect(store => ({ user: store.users.user, login: store.users.login })))(MakeQuestionScreen);