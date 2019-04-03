/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 11:02:11
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import {} from '../../../components';
import { Theme, SCREEN_WIDTH, PxFit } from '../../../utils';

import { BoxShadow } from 'react-native-shadow';
import TaskItem from './TaskItem';

class TaskType extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemHeight: PxFit(70),
			headerHeight: PxFit(50)
		};
	}

	doTask(task) {
		const { navigation, user } = this.props;
		if (task.type == 2) {
			navigation.navigate('SubmitTask', { task_id: task.id, again: false });
		} else if (task.type == 1) {
			navigation.navigate('SubmitTask', { task_id: task.id, again: false });
		} else if (task.type == 3) {
			navigation.navigate('Contribute');
		} else {
			navigation.navigate('EditProfile', { user: user });
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
	width: SCREEN_WIDTH - PxFit(30),
	height: PxFit(150),
	color: '#E8E8E8',
	border: PxFit(10),
	radius: PxFit(10),
	opacity: 0.5,
	x: 0,
	y: 0,
	style: {
		marginHorizontal: PxFit(15),
		marginVertical: PxFit(15)
	}
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Theme.white,
		borderRadius: PxFit(10),
		shadowOffset: { width: PxFit(5), height: PxFit(5) },
		shadowColor: '#E8E8E8',
		shadowOpacity: 0.8,
		shadowRadius: PxFit(10)
	},
	header: {
		marginHorizontal: PxFit(15),
		paddingVertical: PxFit(15)
	},
	text: {
		fontSize: PxFit(16),
		color: Theme.black
	}
});

export default TaskType;
