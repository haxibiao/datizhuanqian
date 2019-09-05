/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 10:42:59
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';

import { SubmitLoading, Banner, TouchFeedback } from 'components';
import { Theme, SCREEN_WIDTH, Config, Tools, ISIOS } from 'utils';

// import { Storage, ItemKeys } from '../../../store/localStorage';

import { Query, Mutation, graphql, withApollo, compose, GQL } from 'apollo';
import { observer, app, config, keys, storage } from 'store';
import { TtAdvert } from 'native';

import TaskType from './TaskType';

@observer
class TaskList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			status: 1, // 是否开启出题,
			ticket: -1,
			gold: 10,
			contribute: 0,
			rewardStatus: 1, //1 开启激励视频 2: 允许重复激励
			rewardTaskAction: 5, //5:看视频，3:任务完成
			rewardTicket: 6,
			rewardGold: 0,
			rewardContribute: 6, //TODO: 都更新build2 后，后端开始给贡献，不给智慧
			cpcStatus: 1, //是否开启CPC阅读
			cpcTaskAction: 6, //5:去阅读，3:任务完成
			cpcTicket: 2,
			cpcGold: 0,
			cpcContribute: 0,
			invitationStatus: 1,
			invitationGold: 100,
			invitationLines: 1,
			tasksCache: null,
			min_level: 2
		};
	}

	componentDidUpdate(nextProps, nextState) {
		let { TasksQuery } = this.props;

		if (TasksQuery && TasksQuery.tasks && nextProps.TasksQuery.tasks !== TasksQuery.tasks) {
			app.updateTaskCache(this.props.TasksQuery.tasks);
		}
		if (nextProps.TasksQuery && nextProps.TasksQuery.tasks) {
			nextProps.navigation.addListener('didFocus', payload => {
				nextProps.TasksQuery.refetch();
			});
		}
	}

	componentDidMount() {
		let { token } = app.me;
		fetch(Config.ServerRoot + '/api/app/task/user-config?api_token=' + token)
			.then(response => response.json())
			.then(data => {
				this.setState({
					//后端出题配置
					ticket: data.chuti.ticket,
					gold: data.chuti.gold,
					status: data.chuti.status,
					contribute: data.chuti.contribute,
					min_level: data.chuti.min_level,
					//后端激励视频配置
					rewardTicket: data.reward.ticket,
					rewardGold: data.reward.gold,
					rewardStatus: data.reward.status,
					rewardContribute: data.reward.contribute,
					//后端CPC配置
					cpcTicket: data.cpc.ticket,
					cpcGold: data.cpc.gold,
					cpcStatus: data.cpc.status,
					cpcContribute: data.cpc.contribute,
					//后端邀请配置
					invitationStatus: data.invitation.status,
					invitationGold: data.invitation.gold,
					invitationLines: data.invitation.withdraw_lines
				});
			})
			.catch(err => {
				console.log('加载task config err', err);
			});

		this.timer = setTimeout(() => {
			if (config.enableReward) {
				//提前加载奖励视频广告，防止ios首次看视频白屏
				this.loadAdManager();
			}
		}, 2000);
	}

	async loadAdManager() {
		let { UserQuery } = this.props;
		if (UserQuery) {
			let { user } = UserQuery;
			//安卓9用户罗静的也容易卡住加载未完成，任务列表里都预加载激励视频
			if (user) {
				if (user.adinfo && user.adinfo.tt_appid) {
					await TtAdvert.RewardVideo.loadAd({
						...user.adinfo,
						uid: user.id
					});
				}
			}
		}
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	render() {
		const { navigation, TasksQuery, UserQuery, taskReward } = this.props;

		const { error, loading, refetch } = TasksQuery;
		const { me, taskCache } = app;

		let {
			ticket,
			gold,
			status,
			contribute,
			rewardStatus,
			rewardTaskAction,
			rewardGold,
			rewardTicket,
			rewardContribute,
			cpcStatus,
			cpcTaskAction,
			cpcTicket,
			cpcGold,
			cpcContribute,
			invitationStatus,
			invitationGold,
			invitationLines
		} = this.state;

		let refetchUserQuery = UserQuery && UserQuery.refetch;
		let adinfo = null;
		if (UserQuery && UserQuery.user) {
			adinfo = UserQuery.user.adinfo;
		}

		let adtasks = [
			{
				name: '看激励视频',
				status: rewardStatus,
				taskAction: rewardTaskAction,
				gold: rewardGold,
				ticket: rewardTicket,
				contribute: rewardContribute,
				type: 4
			},
			{
				name: '出题被采纳',
				status: 1,
				taskAction: 4,
				gold,
				cost: -1, //伪装提示消耗智慧，解释智慧点的消耗用途
				ticket,
				contribute,
				type: 3
			},
			{
				name: '分享给好友',
				status: invitationStatus,
				taskAction: 7,
				gold: invitationGold,
				// contribute: 60,
				invitationLines: invitationLines,
				type: 6
			}
		];
		if (!config.enableReward) {
			adtasks.splice(0, 1);
		}

		//阅读广告任务
		if (UserQuery.user && (UserQuery.user.adinfo.cpc_ad_id !== '0' || UserQuery.user.adinfo.cpc_ad_url !== null)) {
			adtasks.push({
				name: '阅读奖励',
				status: cpcStatus,
				taskAction: cpcTaskAction,
				ticket: cpcTicket,
				gold: cpcGold,
				contribute: cpcContribute,
				type: 5
			});
		}

		let tasks = TasksQuery.tasks;

		if (!tasks) {
			if (taskCache) {
				tasks = taskCache;
			} else {
				return null;
			}
		}

		let newUserTask = tasks.filter((elem, i) => {
			return elem.type == 0;
		});

		//新人任务
		let dailyTask = tasks.filter((elem, i) => {
			return elem.type == 1;
		});

		//每日任务
		let growUpTask = tasks.filter((elem, i) => {
			return elem.type == 2;
		});

		//成长任务
		return (
			<View style={{ flex: 1 }}>
				<Banner />
				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					<TaskType
						tasks={adtasks}
						user={UserQuery.user}
						navigation={navigation}
						name={'激励任务'}
						adinfo={adinfo}
						min_level={this.state.min_level}
						goTask={task => {
							let _this = this;
							if (!adinfo) {
								Toast.show({
									content: '激励视频没加载成功!'
								});
								return;
							}
							TtAdvert.RewardVideo.loadAd({ ...adinfo, uid: me.id }).then(() => {
								//开始看奖励视频
								TtAdvert.RewardVideo.startAd({
									...adinfo,
									uid: me.id
								})
									.then(result => {
										//TODO:ios还不能确定用户的行为做了哪些行为,只奖励精力
										var didWatched = true;
										var adClicked = false;
										if (!ISIOS) {
											let video = {};
											if (result) {
												video = JSON.parse(result);
											}
											if (video.video_play || video.ad_click || video.verify_status) {
												if (video.ad_click) {
													adClicked = true;
													Toast.show({
														content:
															`看视频+看详情: +${task.ticket}精力 ` +
															(task.gold != 0 ? `+${task.gold}智慧` : '') +
															(task.contribute != 0 ? `+${task.contribute}贡献` : '')
													});
												} else {
													Toast.show({
														content: `看完视频 +${task.ticket}精力`
													});
												}

												// 后端通过rewardStatus来控制允许重复激励
												if (rewardStatus < 2) {
													_this.setState({
														rewardTaskAction: 3
													});
												}
											} else {
												didWatched = false;
												Toast.show({
													content: '没看完视频,或没看详情，或其他异常...'
												});
											}
										}

										//后端真的给奖励了
										if (didWatched) {
											let task_id = adClicked ? -2 : 0;
											taskReward({
												variables: {
													task_id
												}
											}).then(() => {
												refetchUserQuery && refetchUserQuery();
											});
										}
									})
									.catch(error => {
										console.log('启动奖励视频error:', error);
									});
							});
						}}
					/>
					{growUpTask.length > 0 && (
						<TaskType
							tasks={growUpTask}
							user={UserQuery.user}
							navigation={navigation}
							name={'成长任务'}
							handlerLoading={this.handlerLoading}
						/>
					)}
					{newUserTask.length > 0 && (
						<TaskType
							tasks={newUserTask}
							user={UserQuery.user}
							navigation={navigation}
							name={'新人任务'}
							handlerLoading={this.handlerLoading}
						/>
					)}

					{dailyTask.length > 0 && (
						<TaskType
							tasks={dailyTask}
							user={UserQuery.user}
							navigation={navigation}
							name={'答题任务'}
							handlerLoading={this.handlerLoading}
						/>
					)}
					<SubmitLoading isVisible={this.state.isVisible} content={'领取中'} />
				</ScrollView>
			</View>
		);
	}

	handlerLoading = () => {
		this.setState({
			isVisible: !this.state.isVisible
		});
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFEFC'
	}
});

export default compose(
	graphql(GQL.TasksQuery, {
		options: props => ({ variables: { offest: 0, limit: 20 } }),
		name: 'TasksQuery'
	}),
	graphql(GQL.UserQuery, {
		options: props => ({ variables: { id: app.me.id } }),
		name: 'UserQuery'
	}),
	graphql(GQL.TaskRewardMutation, {
		name: 'taskReward'
	})
)(withApollo(TaskList));
