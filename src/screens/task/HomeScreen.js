import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';

import { TabTop, BlankContent, Header, Screen } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import TaskList from './components/TaskList';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false
		};
	}

	render() {
		const { login, user, navigation } = this.props;
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
					<TaskList navigation={navigation} />
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
	return { user: store.users.user, login: store.users.login };
})(HomeScreen);
