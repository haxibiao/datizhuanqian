/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 10:42:59
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';

import { SubmitLoading } from '../../../components';
import { Theme, SCREEN_WIDTH } from '../../../utils';

import { connect } from 'react-redux';
import actions from '../../../store/actions';

import { TasksQuery, ReceiveTaskMutation, CompleteTaskMutation } from '../../../assets/graphql/task.graphql';
import { Query, Mutation, graphql, withApollo, compose } from 'react-apollo';

import TaskType from './TaskType';

class TaskList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.data && nextProps.data.tasks) {
			nextProps.navigation.addListener('didFocus', payload => {
				nextProps.data.refetch();
			});
		}
	}

	render() {
		const { login, user, navigation, data } = this.props;
		const { error, loading, refetch } = data;

		if (error) return null;
		if (loading) return null;
		if (!(data && !data.tasks == [])) return null;

		let newUserTask = data.tasks.filter((elem, i) => {
			return elem.type == 0;
		});
		//新人任务

		let dailyTask = data.tasks.filter((elem, i) => {
			return elem.type == 1;
		});
		//每日任务

		let growUpTask = data.tasks.filter((elem, i) => {
			return elem.type == 2;
		});
		//成长任务

		return (
			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				<TaskType
					tasks={[{ name: '我来出题', taskStatus: 4, gold: 10, type: 3 }]}
					user={user}
					navigation={navigation}
					name={'出题任务'}
				/>
				{newUserTask.length > 0 && (
					<TaskType
						tasks={newUserTask}
						user={user}
						navigation={navigation}
						name={'新人任务'}
						handlerLoading={this.handlerLoading}
					/>
				)}

				{dailyTask.length > 0 && (
					<TaskType
						tasks={dailyTask}
						user={user}
						navigation={navigation}
						name={'每日任务'}
						handlerLoading={this.handlerLoading}
					/>
				)}
				{growUpTask.length > 0 && (
					<TaskType
						tasks={growUpTask}
						user={user}
						navigation={navigation}
						name={'成长任务'}
						handlerLoading={this.handlerLoading}
					/>
				)}
				<SubmitLoading isVisible={this.state.isVisible} content={'领取中'} />
			</ScrollView>
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

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(
	compose(
		graphql(TasksQuery, {
			options: props => ({ variables: { offest: 0, limit: 20 } })
		})
	)(withApollo(TaskList))
);
