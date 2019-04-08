/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 11:04:28
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';

import { Button } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

import { ReceiveTaskMutation, TaskRewardMutation, TasksQuery } from '../../../assets/graphql/task.graphql';
import { UserQuery } from '../../../assets/graphql/user.graphql';
import { Mutation, compose, graphql } from 'react-apollo';

class TaskItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	//领取奖励
	taskReward = async () => {
		const { task, user, handlerLoading } = this.props;
		let result = {};
		handlerLoading();
		try {
			result = await this.props.TaskRewardMutation({
				variables: {
					task_id: task.id
				},
				refetchQueries: () => [
					{
						query: TasksQuery
					},
					{
						query: UserQuery,
						variables: { id: user.id }
					}
				]
			});
		} catch (error) {
			result.errors = error;
		}
		if (result && result.errors) {
			handlerLoading();
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
		} else {
			handlerLoading();
			if (result.data.taskReward == 1) {
				Toast.show({ content: '领取成功' });
			} else {
				Toast.show({ content: '已经领取奖励了哦~' });
			}
		}
	};

	//领取任务
	receiveTask = async () => {
		const { task, user, handlerLoading, type, navigation } = this.props;
		let result = {};
		handlerLoading();
		try {
			result = await this.props.ReceiveTaskMutation({
				variables: {
					task_id: task.id
				},
				refetchQueries: () => [
					{
						query: TasksQuery
					},
					{
						query: UserQuery,
						variables: { id: user.id }
					}
				]
			});
		} catch (error) {
			result.errors = error;
		}
		if (result && result.errors) {
			handlerLoading();
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
		} else {
			handlerLoading();
			if (result.data.receiveTask == 1) {
				Toast.show({ content: '领取成功' });
				if (type == 2) {
					navigation.navigate('任务详情', { task_id: task.id });
				}
			} else {
				Toast.show({ content: '已经领取该任务了哦~' });
			}
		}
	};

	_showTask = () => {
		let { navigation, reword, handler, user, task, handleHeight } = this.props;
		switch (task.taskStatus) {
			case -1:
				return (
					<Button
						title={'任务失败'}
						outline
						style={styles.redButton}
						textColor={Theme.secondaryColor}
						fontSize={13}
						onPress={() => {
							navigation.navigate('失败详情', {
								task_id: task.id
							});
						}}
					/>
				);
				break;
			case null:
				return (
					<Button
						title={'领取'}
						outline
						style={styles.themeButton}
						textColor={Theme.primaryColor}
						onPress={this.receiveTask}
					/>
				);
				break;
			case 0:
				return (
					<Button
						title={'做任务'}
						outline
						style={styles.themeButton}
						textColor={Theme.primaryColor}
						onPress={handler}
					/>
				);
				break;
			case 1:
				return (
					<Button name={'审核中'} outline style={styles.themeButton} textColor={Colors.theme} fontSize={13} />
				);
			case 2:
				return (
					<Button
						title={'领取奖励'}
						outline
						style={styles.themeButton}
						textColor={Theme.primaryColor}
						onPress={this.taskReward}
					/>
				);
				break;
			case 3:
				return <Button title={'已完成'} outline disabled style={styles.greyButton} textColor={Theme.grey} />;
				break;
			case 4:
				return (
					<Button
						title={'去出题'}
						outline
						style={styles.themeButton}
						textColor={Theme.primaryColor}
						onPress={handler}
					/>
				);
				break;
		}
	};

	render() {
		let { navigation, reword, handler, user, task, handleHeight } = this.props;
		let { RewarVisible } = this.state;
		return (
			<TouchableOpacity
				activeOpacity={0.6}
				disabled={task.type == 2 ? false : true}
				style={styles.container}
				onPress={() => {
					navigation.navigate('任务详情', { task_id: task.id });
				}}
				onLayout={event => {
					handleHeight(event.nativeEvent.layout.height);
				}}
			>
				<View>
					<Text style={styles.name}>{task.name}</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						{task.gold ? (
							<Text style={styles.reword}>
								奖励
								<Text style={{ color: Theme.primaryColor }}>{`+${task.gold}智慧点 `}</Text>
							</Text>
						) : null}
						{task.ticket > 0 && task.taskStatus == 4 ? (
							<Text style={styles.reword}>
								消耗
								<Text style={{ color: Theme.primaryColor }}>{`-${task.ticket}精力点`}</Text>
							</Text>
						) : null}
						{task.ticket > 0 && task.taskStatus !== 4 ? (
							<Text style={styles.reword}>
								奖励
								<Text style={{ color: Theme.primaryColor }}>{`+${task.ticket}精力点`}</Text>
							</Text>
						) : null}
					</View>
				</View>
				{this._showTask()}
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: PxFit(15),
		paddingVertical: PxFit(12),
		borderTopWidth: PxFit(1),
		borderTopColor: Theme.lightBorder,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	name: {
		color: '#3c3c3c',
		fontSize: PxFit(15)
	},
	reword: {
		color: Theme.grey,
		fontSize: PxFit(13),
		fontWeight: '200'
	},
	greyButton: {
		borderRadius: PxFit(45),
		height: PxFit(32),
		width: PxFit(84),
		borderWidth: PxFit(1),
		borderColor: Theme.grey
	},
	themeButton: {
		borderRadius: PxFit(45),
		height: PxFit(32),
		width: PxFit(84),
		borderWidth: PxFit(1),
		borderColor: Theme.primaryColor
	},
	redButton: {
		borderRadius: PxFit(45),
		height: PxFit(32),
		width: PxFit(84),
		borderWidth: PxFit(1),
		borderColor: Theme.secondaryColor
	}
});

export default compose(
	graphql(TaskRewardMutation, { name: 'TaskRewardMutation' }),
	graphql(ReceiveTaskMutation, { name: 'ReceiveTaskMutation' })
)(TaskItem);
