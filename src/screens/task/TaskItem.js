import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';

import { DivisionLine, ErrorBoundary, TaskRewardModal, Button, Screen } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { ReceiveTaskMutation, TaskRewardMutation, TasksQuery } from '../../graphql/task.graphql';
import { UserQuery } from '../../graphql/user.graphql';
import { Mutation, compose, graphql } from 'react-apollo';

class TaskItem extends Component {
	constructor(props) {
		super(props);
		this.handleRewardModalVisible = this.handleRewardModalVisible.bind(this);
		this.state = {
			RewarVisible: false
		};
	}

	//领取奖励
	taskReward = async () => {
		const { task, user } = this.props;
		let result = {};
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
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100);
		} else {
			if (result.data.taskReward == 1) {
				Methods.toast('领取成功', -80);
			} else {
				Methods.toast('已经领取奖励了哦~', -80);
			}
		}
	};

	//领取任务
	receiveTask = async () => {
		const { task, user } = this.props;
		let result = {};
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
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100);
		} else {
			if (result.data.receiveTask == 1) {
				Methods.toast('领取成功', -80);
			} else {
				Methods.toast('已经领取该任务了哦~', -80);
			}
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
					<Text style={styles.reword}>
						奖励 <Text style={{ color: Colors.theme }}>{`+${task.gold}智慧点`}</Text>
					</Text>
				</View>
				{task.taskStatus == -2 && (
					<Button
						name={'任务失败'}
						outline
						style={styles.redButton}
						textColor={Colors.themeRed}
						fontSize={13}
						handler={() => {
							navigation.navigate('失败详情', { task_id: task.id });
						}}
					/>
				)}
				{task.taskStatus == -1 && (
					<Button
						name={'领取'}
						outline
						style={styles.themeButton}
						textColor={Colors.theme}
						fontSize={13}
						handler={this.receiveTask}
					/>
				)}
				{task.taskStatus == 0 && (
					<Button
						name={'做任务'}
						outline
						style={styles.themeButton}
						textColor={Colors.theme}
						fontSize={13}
						handler={handler}
					/>
				)}
				{task.taskStatus == 1 && (
					<Button name={'审核中'} outline style={styles.themeButton} textColor={Colors.theme} fontSize={13} />
				)}
				{task.taskStatus == 2 && (
					<Button
						name={'领取奖励'}
						outline
						style={styles.themeButton}
						textColor={Colors.theme}
						fontSize={13}
						handler={this.taskReward}
					/>
				)}
				{task.taskStatus == 3 && (
					<Button
						name={'已完成'}
						outline
						disabled
						disabledColor={Colors.white}
						style={styles.greyButton}
						theme={Colors.tintFont}
						textColor={Colors.tintFont}
						fontSize={13}
					/>
				)}

				<TaskRewardModal visible={RewarVisible} handleVisible={this.handleRewardModalVisible} />
			</TouchableOpacity>
		);
	}
	handleRewardModalVisible() {
		this.setState(prevState => ({
			RewarVisible: !prevState.RewarVisible
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 15,
		paddingVertical: 12,
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorder,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	name: {
		color: '#3c3c3c',
		fontSize: 15
	},
	reword: {
		color: Colors.tintFont,
		fontSize: 13,
		fontWeight: '200'
	},
	greyButton: {
		borderRadius: 45,
		height: 32,
		width: 84,
		borderWidth: 1,
		borderColor: Colors.grey
	},
	themeButton: {
		borderRadius: 45,
		// paddingHorizontal: 15,
		height: 32,
		width: 84,
		borderWidth: 1,
		borderColor: Colors.theme
	},
	redButton: {
		borderRadius: 45,
		// paddingHorizontal: 15,
		height: 32,
		width: 84,
		borderWidth: 1,
		borderColor: Colors.themeRed
	}
});

export default compose(
	graphql(TaskRewardMutation, { name: 'TaskRewardMutation' }),
	graphql(ReceiveTaskMutation, { name: 'ReceiveTaskMutation' })
)(TaskItem);
