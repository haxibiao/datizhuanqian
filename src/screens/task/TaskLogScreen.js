import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';

import { TabTop, BlankContent, Header, Screen, LoadingError } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { TasksQuery, ReceiveTaskMutation, CompleteTaskMutation } from '../../graphql/task.graphql';
import { Query, Mutation } from 'react-apollo';

import TaskType from './TaskType';

class TaskLogScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user,
			login: true,
			data: 0
		};
	}

	render() {
		const { data, login } = this.state;
		const { navigation, user } = this.props;

		return (
			<Screen>
				<View />
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
		user: store.users.user
	};
})(TaskLogScreen);
