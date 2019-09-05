/*
 * @Author: Gaoxuan
 * @Date:   2019-05-22 11:39:07
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { Button, Avatar, PageContainer, TouchFeedback, CustomTextInput, Row, Iconfont } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools, Api, Config } from 'utils';

import { BoxShadow } from 'react-native-shadow';
import QRCode from 'react-native-qrcode-svg';

const shadowOpt = {
	width: SCREEN_WIDTH - PxFit(80),
	color: '#E8E8E8',
	border: PxFit(10),
	radius: PxFit(10),
	opacity: 0.5,
	x: 0,
	y: 0,
	style: {
		marginVertical: 20
	}
};

class QuestionShareCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headerHeight: 78
		};
	}
	render() {
		const { navigation, question, shareMiniProgram, user } = this.props;
		// let { question } = navigation.state.params;

		return (
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.questionBody} ref={ref => (this.shareCard = ref)}>
					<BoxShadow
						setting={Object.assign({}, shadowOpt, {
							height: this.state.headerHeight
						})}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: '#FFF',
								marginBottom: 30,
								paddingHorizontal: 10,
								paddingVertical: 10
							}}
							onLayout={event => {
								this.setState({
									headerHeight: event.nativeEvent.layout.height
								});
							}}
						>
							<Avatar source={{ uri: question.user.avatar }} size={56} />
							<View style={{ paddingLeft: 15 }}>
								<Text style={{ color: '#363636', fontSize: 15, lineHeight: 22 }}>
									{question.user.name}
								</Text>

								<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
									<Text style={{ paddingRight: 10, fontSize: 13 }}>
										粉丝 {question.user.followers_count}
									</Text>
									<View style={{ backgroundColor: Theme.grey, width: 0.8, height: 12 }} />
									<Text style={{ paddingLeft: 10, fontSize: 13 }}>
										题目数 {question.user.question_count}
									</Text>
								</View>
							</View>
						</View>
					</BoxShadow>
					<View>
						<Text style={styles.description}>{`${question.description}`}</Text>
						{/*<View style={styles.questionType}>
								<Text style={styles.answerType}>
									{String(question.answer).length > 1 ? '多选' : '单选'}
								</Text>
							</View>*/}
					</View>
					{question && question.image && (
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<Image
								style={{
									marginTop: PxFit(Theme.itemSpace),
									width: SCREEN_WIDTH - PxFit(80),
									height: ((SCREEN_WIDTH - PxFit(80)) * 9) / 16
								}}
								source={{ uri: question.image.path }}
							/>
						</View>
					)}
					<View style={{ marginTop: 25 }}>
						{question.selections_array.map((option, index) => {
							return (
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginBottom: PxFit(20)
									}}
									key={index}
								>
									<View
										style={{
											marginRight: PxFit(15),
											width: PxFit(34),
											height: PxFit(34),
											borderRadius: PxFit(17),
											borderWidth: PxFit(0.8),
											borderColor: Theme.lightGray,
											justifyContent: 'center',
											alignItems: 'center'
										}}
									>
										<Text style={{ fontSize: PxFit(15), color: Theme.defaultTextColor }}>
											{option.Value}
										</Text>
									</View>
									<View style={{ flex: 1, minHeight: PxFit(34), justifyContent: 'center' }}>
										<Text
											style={{
												fontSize: PxFit(14),
												lineHeight: PxFit(20),
												color: Theme.defaultTextColor
											}}
										>
											{option.Text}
										</Text>
									</View>
								</View>
							);
						})}
					</View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end',
							justifyContent: 'space-between',
							// paddingHorizontal: 5,
							paddingBottom: 5
						}}
					>
						<Image source={require('../../../../icon.png')} style={{ width: 48, height: 48 }} />

						<View style={{ height: 40, justifyContent: 'center' }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text
									style={{
										fontSize: 11,
										paddingRight: 5
									}}
								>
									<Text style={{ fontSize: 11 }}>{question.count} </Text>次答题
								</Text>
								<View style={{ backgroundColor: Theme.grey, width: 0.8, height: 12 }} />
								<Text style={{ fontSize: 11, paddingLeft: 5 }}>
									{'答对率 '}
									<Text style={{ fontSize: 11 }}>
										{correctRate(question.correct_count, question.count)}
									</Text>
								</Text>
							</View>
							<Text style={{ fontSize: 11, marginTop: 5 }}>学有所伴 见证成长每一步</Text>
						</View>
						<View style={{ height: 40, width: 40 }}>
							<QRCode
								value={`https://datizhuanqian.com/invitation?user_id=${user.id}`}
								size={40}
								color={'#000'}
								backgroundColor={'#FFF'}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}

	onCapture = async isShow => {
		let image = await Api.viewShotUtil.capture(this.shareCard);
		let result = await Api.viewShotUtil.saveImage(image, isShow);
		console.log('Api.viewShotUtil.saveImage(image);', result);
		// this.props.navigation.goBack();
		return result;
	};
}

function correctRate(correct, count) {
	if (typeof correct === 'number' && typeof count === 'number') {
		let result = (correct / count) * 100;
		if (result) {
			return result.toFixed(1) + '%';
		}
		return '0';
	}
}

const styles = StyleSheet.create({
	questionBody: {
		marginBottom: PxFit(20),
		marginHorizontal: 25,
		marginVertical: 20,
		paddingHorizontal: 15,
		paddingVertical: 15,
		// borderRadius: 3,
		backgroundColor: Theme.white
	},
	description: {
		color: Theme.defaultTextColor,
		fontSize: PxFit(15),
		lineHeight: PxFit(22)
	},
	questionType: {
		position: 'absolute',
		top: 2,
		left: 0,
		width: PxFit(36),
		height: PxFit(18),
		borderTopLeftRadius: PxFit(9),
		borderBottomRightRadius: PxFit(9),
		backgroundColor: Theme.primaryColor,
		justifyContent: 'center',
		alignItems: 'center'
	},
	answerType: {
		fontSize: PxFit(11),
		color: '#fff'
	}
});

export default QuestionShareCard;
