/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:24
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, FlatList } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	ListItem,
	CustomSwitch,
	ItemSeparator,
	PopOverlay,
	CustomRefreshControl,
	ListFooter,
	Placeholder
} from '../../components';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';
import { Query, withApollo, compose, graphql } from 'react-apollo';
import { UserQuery } from '../../assets/graphql/user.graphql';
import { CategoriesQuery, QuestionQuery } from '../../assets/graphql/question.graphql';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <PageContainer title="答题赚钱" isTopNavigator />;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});

export default compose(
	withApollo,
	connect(store => {
		return {
			user: store.users.user,
			login: store.users.login,
			isUpdate: store.users.isUpdate
		};
	}),
	graphql(CategoriesQuery, { options: props => ({ variables: { limit: 10 } }) })
)(index);
