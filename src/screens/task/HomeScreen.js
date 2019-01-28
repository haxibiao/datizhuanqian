import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';

import { TabTop, BlankContent, Header, Screen, LoadingError } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { TasksQuery, ReceiveTaskMutation, CompleteTaskMutation } from '../../graphql/task.graphql';
import { Query, Mutation } from 'react-apollo';

import TaskType from './TaskType';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, user, login } = this.props;
		console.log('login', login);
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
				{login ? (
					<Query query={TasksQuery}>
						{({ data, error, loading, refetch }) => {
							navigation.addListener('didFocus', payload => {
								refetch();
							});
							if (error) return <LoadingError />;
							if (!(data && data.tasks == []))
								return <BlankContent text={'暂时还没有任务哦~'} fontSize={14} />;

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
									{newUserTask.length > 0 && (
										<TaskType
											tasks={newUserTask}
											user={user}
											navigation={navigation}
											name={'新人任务'}
										/>
									)}
									{dailyTask.length > 0 && (
										<TaskType
											tasks={dailyTask}
											user={user}
											navigation={navigation}
											name={'每日任务'}
										/>
									)}
									{growUpTask.length > 0 && (
										<TaskType
											tasks={growUpTask}
											user={user}
											navigation={navigation}
											name={'成长任务'}
										/>
									)}
								</ScrollView>
							);
						}}
					</Query>
				) : (
					<BlankContent text={'登录之后才能查看任务哦~'} fontSize={14} />
				)}
			</Screen>
		);
	}
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
})(HomeScreen);
