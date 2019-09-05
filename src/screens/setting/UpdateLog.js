/*
 * @Author: Gaoxuan
 * @Date:   2019-04-11 09:17:48
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { PageContainer } from 'components';
import { Theme, PxFit, Config } from 'utils';

class UpdateLogScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			updateLog: [
				{
					version: '1.8.1',
					issue: '修复已知bug',
					add: '1.优化答题体验'
				},
				{
					version: '1.8.0',
					issue: '修复已知bug',
					add:
						'1.支持评论互动楼中楼\n2.题目支持添加查看解析，支持视频解析。\n3.优化视频体验\n4.更新大量题库，开放大量精彩视频题目'
				},
				{
					version: '1.7.0',
					issue: '修复已知问题',
					add: '无'
				},
				{
					version: '1.6.0',
					issue: '修复已知问题',
					add: '1.增加激励视频。\n2.用户点赞通知\n3.周贡献查看\n4.增加审题人记录'
				},
				{
					version: '1.5.0',
					issue: '优化题目加载速度，修复错题，提现速度优化',
					add:
						'1.全新改版，视觉优化，尽享至美体验。\n2.全新题目评论功能。\n3.新增用户审题功能。\n4.新增智慧点变更记录'
				},
				{
					version: '1.4.0',
					issue: '用户体验优化，适配机型，修复错题，修复手机邮箱验证',
					add:
						'1.视频出题功能重磅上线：题目你来出，不怕被题虐！\n2.新增用户展示页：关注出题大神，以题会友\n3.题目纠错：错题太多你来改，不怕你吐槽！\n4.全新题库上线：新颖短视频电影题目，等你来拿\n5.反馈评论插图功能：可以尽情的用表情包吐槽了!\n6.增加推送通知，可以收到答题官方的最新提醒了'
				},
				{
					version: '1.3.0',
					issue: '优化用户交互，修复错题，',
					add:
						'1.扩充任务模块：智慧点精力点奖励更多\n2.新增反馈功能：更方便快捷的与开发团队交流\n3.新增通知消息：可即时查看提现通知及反馈回复消息'
				},
				{
					version: '1.2.0',
					issue: '修复提现问题，优化提现体验',
					add: '1.任务功能\n'
				}
			]
		};
	}
	render() {
		let { updateLog } = this.state;
		return (
			<PageContainer white title="更新日志">
				<ScrollView style={{ flex: 1 }}>
					{updateLog.map((item, index) => {
						return (
							<View style={styles.container} key={index}>
								<Text style={styles.version}>{item.version}</Text>
								<Text style={styles.title}>修复问题：</Text>
								<Text style={styles.content}>{item.issue}</Text>
								<Text style={styles.title}>新功能：</Text>
								<Text style={styles.content}>{item.add}</Text>
							</View>
						);
					})}
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		paddingTop: 15
	},
	version: {
		fontSize: 18,
		color: Theme.black,
		fontWeight: '600'
	},
	title: {
		fontSize: 15,
		color: Theme.black,
		paddingTop: 10,
		fontWeight: '500'
	},
	content: {
		fontSize: 13,
		color: '#363636',
		lineHeight: 20,
		paddingTop: 5
	}
});

export default UpdateLogScreen;
