/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:02
 */
'use strict';

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';
import { PageContainer, TabBar, EmptyView } from '../../components';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import TaskList from './components/TaskList';

class index extends Component {
	render() {
		const { login, navigation } = this.props;
		return (
			<PageContainer isTopNavigator title="任务">
				<TabBar />
				{login ? (
					<TaskList navigation={navigation} />
				) : (
					<EmptyView
						imageSource={require('../../assets/images/default_message.png')}
						title="登录之后才能查看任务哦"
					/>
				)}
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => {
	return { login: store.users.login };
})(index);
