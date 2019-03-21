/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:02
 */
'use strict';

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';
import { PageContainer, TabBar } from '../../components';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import TaskList from './components/TaskList';

class index extends Component {
	render() {
		const { login, navigation } = this.props;
		return (
			<PageContainer isTopNavigator title="任务">
				<TabBar />
				{login ? <TaskList navigation={navigation} /> : null}
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => {
	return { login: store.users.login };
})(index);
