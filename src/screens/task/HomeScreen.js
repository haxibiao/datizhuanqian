import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
	Image,
	Text,
	Dimensions,
	DeviceEventEmitter
} from 'react-native';

import { TabTop, Banner, BlankContent, Button, Header } from '../../components';
import Screen from '../Screen';
import { Colors, Config, Divice } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { BoxShadow } from 'react-native-shadow';

import TaskItem from './TaskItem';
import { TasksQuery, ReceiveTaskMutation, CompleteTaskMutation } from '../../graphql/task.graphql';
import { Query, Mutation } from 'react-apollo';

const { width, height } = Dimensions.get('window');

const shadowOpt = {
	width: width - 30,
	height: 150,
	color: '#E8E8E8',
	border: 10,
	radius: 10,
	opacity: 0.5,
	x: 0,
	y: 0,
	style: {
		marginHorizontal: 15,
		marginVertical: 15
	}
};

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user,
			login: false,
			data: 0
		};
	}

	render() {
		const { data, login } = this.state;
		const { navigation, user } = this.props;

		return (
			<Screen header>
				<Header
					headerLeft={<Text />}
					customStyle={{
						backgroundColor: Colors.theme,
						borderBottomWidth: 0
					}}
				/>
				<View style={styles.container}>
					<TabTop user={user} />
					{/*<Banner />*/}
					{login ? (
						<ScrollView>
							<Query query={TasksQuery} variables={{ type: 0 }} fetchPolicy="network-only">
								{({ data, error, loading, refetch }) => {
									navigation.addListener('didFocus', payload => {
										refetch();
									});
									if (error) return null;
									if (!(data && data.tasks)) return null;
									return (
										<BoxShadow
											setting={Object.assign({}, shadowOpt, {
												height: 46 + 72 * data.tasks.length
											})}
										>
											<View
												style={{
													backgroundColor: Colors.white,
													borderRadius: 10,
													height: 46 + 72 * data.tasks.length,
													shadowOffset: { width: 5, height: 5 },
													shadowColor: '#E8E8E8',
													shadowOpacity: 0.8,
													shadowRadius: 10
												}}
											>
												<View
													style={{
														marginHorizontal: 15,
														paddingVertical: 15
													}}
												>
													<Text style={{ fontSize: 16, color: Colors.black }}>新人任务</Text>
												</View>

												{data.tasks.map((task, index) => {
													return (
														<TaskItem
															title={task.description}
															reword={`+${task.gold}智慧点`}
															key={index}
															handler={() => {
																navigation.navigate('编辑个人资料');
															}}
															task_id={task.id}
															status={task.taskStatus}
															type={0}
														/>
													);
												})}
											</View>
										</BoxShadow>
									);
								}}
							</Query>

							<Query query={TasksQuery} variables={{ type: 1 }}>
								{({ data, error, loading, refetch }) => {
									navigation.addListener('didFocus', payload => {
										refetch();
									});
									if (error) return null;
									if (!(data && data.tasks)) return null;
									return (
										<BoxShadow
											setting={Object.assign({}, shadowOpt, {
												height: 46 + 72 * 4
											})}
										>
											<View
												style={{
													backgroundColor: Colors.white,
													borderRadius: 10,
													height: 46 + 72 * 4,
													shadowOffset: { width: 5, height: 5 },
													shadowColor: '#E8E8E8',
													shadowOpacity: 0.8,
													shadowRadius: 10
												}}
											>
												<View
													style={{
														marginHorizontal: 15,
														paddingVertical: 15
													}}
												>
													<Text style={{ fontSize: 16, color: Colors.black }}>每日任务</Text>
												</View>
												<TaskItem title={'参与10道答题'} reword={'+20精力点'} status={1} />
												<TaskItem title={'完成5道题目纠错'} reword={'+20精力点'} status={0} />
												<TaskItem title={'分享朋友圈'} reword={'+10精力点'} status={-1} />
												<TaskItem title={'邀请新用户'} reword={'+15精力点'} status={2} />
											</View>
										</BoxShadow>
									);
									//先静态UI用来测试
								}}
							</Query>
						</ScrollView>
					) : (
						<BlankContent text={'暂时还没有任务哦~'} fontSize={14} />
					)}
				</View>
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
