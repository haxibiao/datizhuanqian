import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Button, Header, Screen } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import TaskItem from './TaskItem';
import { BoxShadow } from 'react-native-shadow';

class TaskType extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemHeight: 70,
			headerHeight: 50
		};
	}

	doTask(task) {
		const { navigation, user } = this.props;
		console.log('task', task);
		if (task.type == 2) {
			navigation.navigate('提交任务', { task_id: task.id, again: false });
		} else if (task.type == 1) {
			navigation.navigate('答题');
		} else if (task.type == 3) {
			navigation.navigate('问题创建');
		} else {
			navigation.navigate('编辑个人资料', { user: user });
		}
	}

	render() {
		const { navigation, tasks, user, name, handlerLoading } = this.props;
		let { itemHeight, headerHeight } = this.state;

		return (
			<BoxShadow
				setting={Object.assign({}, shadowOpt, {
					height: headerHeight + itemHeight * tasks.length
				})}
			>
				<View style={[styles.container, { height: headerHeight + itemHeight * tasks.length }]}>
					<View
						style={styles.header}
						onLayout={event => {
							this.setState({
								headerHeight: event.nativeEvent.layout.height
							});
						}}
					>
						<Text style={styles.text}>{name}</Text>
					</View>

					{tasks.map((task, index) => {
						return (
							<TaskItem
								user={user}
								key={index}
								handler={() => {
									this.doTask(task);
								}}
								type={task.type}
								navigation={navigation}
								task={task}
								handleHeight={height => {
									this.setState({
										itemHeight: height
									});
								}}
								handlerLoading={handlerLoading}
							/>
						);
					})}
				</View>
			</BoxShadow>
		);
	}
	handleHeight(height) {
		this.setState({
			itemHeight: height
		});
	}
}

const shadowOpt = {
	width: Divice.width - 30,
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

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		borderRadius: 10,
		shadowOffset: { width: 5, height: 5 },
		shadowColor: '#E8E8E8',
		shadowOpacity: 0.8,
		shadowRadius: 10
	},
	header: {
		marginHorizontal: 15,
		paddingVertical: 15
	},
	text: {
		fontSize: 16,
		color: Colors.black
	}
});

export default TaskType;
