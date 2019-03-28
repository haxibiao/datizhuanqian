/*
 * @flow
 * created by wyk made in 2019-03-22 16:26:04
 */
'use strict';

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
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	CustomTextInput,
	KeyboardSpacer,
	DropdownMenu,
	PullChooser,
	ProgressOverlay,
	OverlayViewer
} from '../../components';
import { Theme, PxFit, Api, Config, SCREEN_WIDTH, ISAndroid } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { createQuestionMutation } from '../../assets/graphql/task.graphql';
import { CategoriesQuery, QuestionQuery } from '../../assets/graphql/question.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';

import OptionItem from './components/OptionItem';

const ANSWERS = ['A', 'B', 'C', 'D'];

class index extends Component {
	constructor(props) {
		super(props);
		this.categories = [];
		this.dropData = null;
		this.variables = null;
		this.uploading = false;
		this.state = {
			uploadId: null,
			category_id: null,
			video_id: null,
			description: null,
			picture: null,
			video_path: null,
			optionValue: null,
			answers: new Set(),
			options: new Map(),
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
		if (this.uploading) {
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
		if (data && data.categories) {
			this.categories = data.categories;
			data = data.categories.map((elem, index) => {
				return elem.name;
			});
		} else {
			data = [['请选择题库']];
		}
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
		let { favorited } = this.state;
		let { login, navigation, favoriteArticle } = this.props;
		PullChooser.show([
			{
				title: '视频',
				onPress: () => this.videoPicke()
			},
			{
				title: '图片',
				onPress: () => this.imagePicke()
			}
		]);
	};

	imagePicke = () => {
		Api.imagePicker(
			image => {
				image = `data:${image.mime};base64,${image.data}`;
				this.setState({ picture: image });
			},
			{
				multiple: false,
				includeBase64: true
			}
		);
	};

	videoPicke = () => {
		Api.videoPicker(
			video => {
				this.setState({ video_path: video.path });
			},
			{
				onBeforeUpload: metadata => {
					if (metadata.duration > 15) {
						this.setState({ video_path: null });
						Toast.show({ content: '抱歉，视频时长需在15秒以内' });
						throw '视频时长需在15秒以内';
					}
				},
				onStarted: uploadId => {
					ProgressOverlay.show('正在上传视频');
					this.uploading = true;
					this.setState({ uploadId });
				},
				onProcess: progress => {
					console.log('test progress', progress);
					ProgressOverlay.progress(progress);
				},
				onCancelled: () => {
					console.log('onCancelled');
				},
				onCompleted: async video => {
					if (this.uploading) {
						Api.saveVideo(
							video,
							video => {
								ProgressOverlay.hide();
								this.uploading = false;
								this.setState({ video_id: video.id });
							},
							this.onUploadError
						);
					}
				},
				onError: this.onUploadError
			}
		);
	};

	onUploadError = () => {
		ProgressOverlay.hide();
		this.uploading = false;
		Toast.show({ content: '视频上传失败' });
		this.setState({ video_path: null });
	};

	onCancelUpload = () => {
		if (this.uploading) {
			ISAndroid && Api.cancelUpload(this.state.uploadId);
			ProgressOverlay.hide();
			this.uploading = false;
			this.setState({ uploadId: null, video_path: null });
		}
	};

	closeMedia = () => {
		if (this.state.video_path) {
			this.setState({ uploadId: null, video_path: null, video_id: null });
		} else {
			this.setState({ picture: null });
		}
	};

	showPicture = url => {
		let overlayView = (
			<ImageViewer onSwipeDown={() => OverlayViewer.hide()} imageUrls={[{ url }]} enableSwipeDown />
		);
		OverlayViewer.show(overlayView);
	};

	reviewVideo = path => {
		let overlayView = (
			<Video
				source={{
					uri: path
				}}
				style={styles.videoViewer}
				muted={false}
				paused={false}
				resizeMode="contain"
			/>
		);
		OverlayViewer.show(overlayView);
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

	onSubmit = createQuestion => {
		return () => {
			if (!this.variables) {
				Toast.show({ content: '请确保分类/题干/答案填写完整' });
				return;
			}
			this.setState({ submitLoading: true });
			createQuestion();
		};
	};

	onCompleted = () => {
		this.setState({ submitLoading: false });
		this.props.navigation.replace('ContributeSubmited');
	};

	onError = error => {
		console.log(error);
		this.setState({ submitLoading: false });
		Toast.show({ content: '提交出错' });
	};

	render() {
		let { navigation, user, login, data } = this.props;
		let {
			category_id,
			description,
			picture,
			video_path,
			options,
			optionValue,
			answers,
			submitLoading
		} = this.state;
		let disableAddButton = options.size >= 4 || !optionValue;
		this.buildDropData(data);
		this.variables = this.buildVariables();
		return (
			<Mutation
				mutation={createQuestionMutation}
				variables={this.variables}
				onCompleted={this.onCompleted}
				onError={this.onError}
			>
				{createQuestion => {
					return (
						<PageContainer
							white
							title="创建问题"
							loading={submitLoading}
							rightView={
								<TouchFeedback style={styles.saveButton} onPress={this.onSubmit(createQuestion)}>
									<Text style={styles.saveText}>提交</Text>
								</TouchFeedback>
							}
						>
							<View style={styles.container}>
								<DropdownMenu
									dropStyle={styles.dropStyle}
									dropItemStyle={{ alignItems: 'flex-end' }}
									lables={['请选择题库']}
									lable={
										<Row>
											<Image
												style={{ width: PxFit(14), height: PxFit(14), marginRight: PxFit(4) }}
												source={require('../../assets/images/category.png')}
											/>
											<Text style={styles.lableText}>题目分类</Text>
										</Row>
									}
									bgColor={'white'}
									tintColor={'#666666'}
									activityTintColor={Theme.primaryColor}
									handler={(selection, row) => this.dropHandler(this.dropData[selection][row])}
									data={this.dropData}
								>
									<ScrollView
										keyboardDismissMode={'none'}
										style={styles.container}
										contentContainerStyle={styles.scrollStyle}
										ref={ref => (this._ScrollView = ref)}
									>
										<View style={styles.main}>
											<View style={styles.section_top}>
												<CustomTextInput
													style={styles.questionInput}
													onChangeText={text => this.setState({ description: text.trim() })}
													multiline
													maxLength={300}
													textAlignVertical="top"
													placeholder="填写题目题干..."
												/>
												<View style={styles.mediaSelect}>
													{picture ? (
														<TouchFeedback onPress={() => this.showPicture(picture)}>
															<Image source={{ uri: picture }} style={styles.addImage} />
															<TouchableOpacity
																style={styles.closeBtn}
																onPress={this.closeMedia}
															>
																<Iconfont
																	name={'close'}
																	size={PxFit(20)}
																	color="#fff"
																/>
															</TouchableOpacity>
														</TouchFeedback>
													) : video_path ? (
														<TouchFeedback onPress={() => this.reviewVideo(video_path)}>
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
																<Iconfont
																	name={'close'}
																	size={PxFit(20)}
																	color="#fff"
																/>
															</TouchableOpacity>
														</TouchFeedback>
													) : (
														<TouchableOpacity
															style={styles.addImage}
															onPress={this.showSelected}
														>
															<Image
																style={{ width: PxFit(40), height: PxFit(30) }}
																source={require('../../assets/images/camera.png')}
															/>
														</TouchableOpacity>
													)}
													<TouchFeedback
														onPress={() => {
															navigation.navigate('ContributeRule');
														}}
													>
														<Row>
															<Iconfont
																name={'question'}
																size={PxFit(14)}
																color={Theme.subTextColor}
															/>
															<Text style={styles.ruleText}>出题规则</Text>
														</Row>
													</TouchFeedback>
												</View>
											</View>
											<View style={styles.answerContainer}>
												<Row>
													<Text style={styles.lableText}>答案选项</Text>
													<Text style={styles.answerTip}>
														(别忘记点击选项设置来正确答案哦)
													</Text>
												</Row>
												<Row style={{ marginTop: PxFit(6) }}>
													<Text style={styles.answerText}>正确答案：</Text>
													<Text style={[styles.answerText, { color: Theme.linkColor }]}>
														{[...answers].join(',')}
													</Text>
												</Row>
											</View>
											{[...options].map((option, index) => {
												return (
													<OptionItem
														key={index}
														style={{
															paddingRight: PxFit(Theme.itemSpace),
															marginTop: PxFit(Theme.itemSpace) * 2
														}}
														option={{ Value: ANSWERS[index], Text: option[0] }}
														isAnswer={option[1]}
														reduceAnswer={this.reduceAnswer}
														remove={this.removeOption}
													/>
												);
											})}
										</View>
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
													styles.selectionButton,
													!disableAddButton && { backgroundColor: Theme.primaryColor }
												]}
												onPress={this.addOption}
											>
												<Text style={styles.addText}>添 加</Text>
											</TouchableOpacity>
										</View>
									</View>
								</DropdownMenu>
							</View>
						</PageContainer>
					);
				}}
			</Mutation>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	saveButton: {
		flex: 1,
		justifyContent: 'center'
	},
	saveText: { fontSize: PxFit(15), textAlign: 'center', color: Theme.secondaryColor },
	dropStyle: {
		paddingHorizontal: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(0.5),
		borderColor: Theme.borderColor
	},
	scrollStyle: {
		flexGrow: 1,
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT + 50
	},
	submitButton: {
		width: 60,
		height: 25,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		alignItems: 'center'
	},
	lableText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	},
	main: { paddingLeft: PxFit(Theme.itemSpace) },
	section_top: {
		paddingVertical: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(0.5),
		borderColor: Theme.borderColor
	},
	mediaSelect: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginTop: PxFit(Theme.itemSpace),
		paddingRight: PxFit(Theme.itemSpace)
	},
	questionInput: {
		fontSize: PxFit(15),
		lineHeight: PxFit(20),
		height: PxFit(100),
		backgroundColor: '#fff'
	},
	addImage: {
		width: PxFit(100),
		height: PxFit(100),
		backgroundColor: Theme.groundColour,
		justifyContent: 'center',
		alignItems: 'center'
	},
	closeBtn: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: PxFit(20),
		height: PxFit(20),
		backgroundColor: 'rgba(0,0,0,0.2)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	ruleText: { fontSize: PxFit(13), color: Theme.subTextColor, marginLeft: PxFit(2) },
	answerContainer: {
		marginTop: PxFit(Theme.itemSpace)
	},
	answerText: {
		fontSize: PxFit(14),
		lineHeight: PxFit(16),
		color: Theme.subTextColor
	},
	answerTip: {
		marginLeft: PxFit(5),
		fontSize: PxFit(12),
		color: Theme.secondaryColor
	},
	bottom: {
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		backgroundColor: '#f7f7f7'
	},
	inputContainer: {
		height: PxFit(50),
		paddingHorizontal: PxFit(Theme.itemSpace),
		flexDirection: 'row',
		alignItems: 'center'
	},
	optionInput: {
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		marginRight: PxFit(15)
	},
	selectionButton: {
		width: PxFit(58),
		borderRadius: PxFit(4),
		height: PxFit(34),
		backgroundColor: '#A0A0A0',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addText: {
		fontSize: PxFit(15),
		color: '#fff'
	},
	videoViewer: {
		position: 'absolute',
		width: '100%',
		height: '100%'
	}
});

export default compose(
	connect(store => ({ user: store.users.user, login: store.users.login })),
	graphql(CategoriesQuery, { options: props => ({ variables: { limit: 100 } }) })
)(index);
