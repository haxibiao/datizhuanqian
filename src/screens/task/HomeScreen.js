import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';

import { TabTop, BlankContent, Header, Screen, LoadingError, Loading } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { TasksQuery, ReceiveTaskMutation, CompleteTaskMutation } from '../../graphql/task.graphql';
import { Query, Mutation, graphql, withApollo, compose } from 'react-apollo';

import TaskType from './TaskType';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.data && nextProps.data.tasks) {
			nextProps.navigation.addListener('didFocus', payload => {
				nextProps.data.refetch();
			});
		}
		//props更新时存入用户信息
	}

	render() {
		const { login, user } = this.props;

		return (
			<Screen header>
				<Header
					headerLeft
					customStyle={{
						backgroundColor: Colors.theme,
						borderBottomWidth: 0,
						borderBottomColor: 'transparent'
					}}
				/>
				<TabTop user={user} />
				{login ? this._renderTaskList() : <BlankContent text={'登录之后才能查看任务哦~'} fontSize={14} />}
			</Screen>
		);
	}
	_renderTaskList = () => {
		const {
			user,
			data,
			navigation,
			data: { error, loading, refecth }
		} = this.props;

		if (error) return <LoadingError />;
		if (loading) return <Loading />;
		if (!(data && !data.tasks == [])) return <BlankContent text={'暂时还没有任务哦~'} fontSize={14} />;

		let newUserTask = data.tasks.filter((elem, i) => {
			return elem.type == 0;
		});

		let dailyTask = data.tasks.filter((elem, i) => {
			return elem.type == 1;
		});

		let growUpTask = data.tasks.filter((elem, i) => {
			return elem.type == 2;
		});
		return (
			<ScrollView style={{ flex: 1 }}>
				<TaskType
					tasks={[{ name: '用户出题', taskStatus: 4, gold: 20, type: 3 }]}
					user={user}
					navigation={navigation}
					name={'出题任务'}
				/>
				{newUserTask.length > 0 && (
					<TaskType tasks={newUserTask} user={user} navigation={navigation} name={'新人任务'} />
				)}

				{dailyTask.length > 0 && (
					<TaskType tasks={dailyTask} user={user} navigation={navigation} name={'每日任务'} />
				)}
				{growUpTask.length > 0 && (
					<TaskType tasks={growUpTask} user={user} navigation={navigation} name={'成长任务'} />
				)}
			</ScrollView>
		);
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
	)(withApollo(HomeScreen))
);
