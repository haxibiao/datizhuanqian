/*
 * @flow
 * created by wyk made in 2019-03-25 09:51:17
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from 'utils';

class CommonIssue extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user
		};
	}
	render() {
		const { counts } = this.state;
		return (
			<PageContainer title="常见问题" white>
				<ScrollView
					contentContainerStyle={styles.container}
					showsVerticalScrollIndicator={false}
					bounces={false}
				>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：提现不了，怎么办？</Text>
							<Text style={styles.answerText}>
								A：请先检查您的网络是否正常以及APP是否是最新版本或尝试重新登录，若还不能提现，请联系我们的官方QQ群（735220029），或在意见反馈里提交，我们会在第一时间为您解决。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：免广告是什么？</Text>
							<Text style={styles.answerText}>
								A：答题时花费一定的智慧点就可以24小时免广告，但只限当前题目所在专题哦。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：被限制提现怎么办？</Text>
							<Text style={styles.answerText}>
								A：一个人名下只能绑定一个支付宝提现，同一人使用多个账号提现,系统将判定涉嫌恶意刷取智慧点，
								{Config.AppName}官方有权限制提现功能。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：绑定支付宝账户是否会有风险？ </Text>
							<Text style={styles.answerText}>
								A：绑定支付宝账户只是为了方便给您提现哦，除了您的支付宝账户，我们不会获取您支付宝的任何信息，完全不用担心会有风险哦。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：题目出现问题怎么办?</Text>
							<Text style={styles.answerText}>
								A：可以使用举报功能提供错误信息，我们收到您的错误信息会在最快的时间内对题目进行纠正哦
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：无法答题或查看信息,怎么办?</Text>
							<Text style={styles.answerText}>A：请先检查您的网络是否正常或尝试重新登录。</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：无法更新怎么办?</Text>
							<Text style={styles.answerText}>
								A：请到xiaodamei.com下载最新版本，如遇无法安装，请先卸载旧的
								{Config.AppName}再安装。
							</Text>
						</View>
					</View>
					{/*<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：怎么获得道具？</Text>
							<Text style={styles.answerText}>
								A：您可以在道具商城用智慧点去购买您想要的道具，也可以在任务中心做任务来获取道具哦
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：道具有什么作用？</Text>
							<Text style={styles.answerText}>
								A：我们的道具有很多种呢，您可以在道具商城看到所有道具的介绍哦。
							</Text>
						</View>
					</View>*/}
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Text style={styles.questionText}>Q：忘记密码了怎么办？</Text>
							<Text style={styles.answerText}>
								A：您可以根据自己绑定的手机号码或者邮箱地址来找回密码或更改密码哦。
							</Text>
						</View>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingTop: PxFit(10),
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		backgroundColor: Theme.groundColour
	},
	issueItem: {
		paddingVertical: PxFit(15),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor,
		backgroundColor: '#fff'
	},
	issuePH: {
		paddingHorizontal: PxFit(20)
	},
	questionText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	},
	answerText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		marginTop: PxFit(15),
		lineHeight: PxFit(15)
	}
});

export default CommonIssue;
