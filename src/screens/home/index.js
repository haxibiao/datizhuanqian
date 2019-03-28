/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:20
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
	Placeholder,
	TabBar,
	UpdateOverlay
} from '../../components';
import { Api } from '../../utils';
import PlateItem from './components/PlateItem';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';
import { Query, withApollo, compose, graphql } from 'react-apollo';
import { UserQuery } from '../../assets/graphql/user.graphql';
import { CategoriesQuery, QuestionQuery } from '../../assets/graphql/question.graphql';

import SplashScreen from 'react-native-splash-screen';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false,
			categoryCache: null
		};
	}

	componentDidMount() {
		this.loadCache();
		SplashScreen.hide();
		// UpdateOverlay.show();

		this.timer = setTimeout(() => {
			Api.checkUpdate(this.dispatch.bind(this));
		}, 3000);
		// this.dispatch();
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.data && nextProps.data.categories) {
			this.props.dispatch(actions.categoryCache(nextProps.data.categories));
		}
	}

	dispatch(serverVersion) {
		this.props.dispatch(actions.UpdateViewedVesion(serverVersion));
	}

	async loadCache() {
		let categoryCache = await Storage.getItem(ItemKeys.categoryCache);
		this.setState({ categoryCache });
	}

	_renderCategoryList = () => {
		let {
			user,
			login,
			navigation,
			data: { loading, error, categories, refetch, fetchMore }
		} = this.props;
		let questionCategories = categories;
		if (!questionCategories) {
			if (this.state.categoryCache) {
				questionCategories = this.state.categoryCache;
			} else {
				return Array(10)
					.fill(0)
					.map((elem, index) => {
						return <Placeholder key={index} type="list" />;
					});
			}
		}
		return (
			<View style={styles.container}>
				<TabBar />
				<FlatList
					showsVerticalScrollIndicator={false}
					data={questionCategories}
					refreshControl={<CustomRefreshControl refreshing={loading} onRefresh={refetch} />}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => (
						<PlateItem category={item} navigation={navigation} login={login} />
					)}
					onEndReachedThreshold={0.3}
					onEndReached={() => {
						if (categories && questionCategories) {
							fetchMore({
								variables: {
									offset: questionCategories.length
								},
								updateQuery: (prev, { fetchMoreResult }) => {
									if (
										!(
											fetchMoreResult &&
											fetchMoreResult.categories &&
											fetchMoreResult.categories.length > 0
										)
									) {
										this.setState({
											finished: true
										});
										return prev;
									}
									return Object.assign({}, prev, {
										categories: [...prev.categories, ...fetchMoreResult.categories]
									});
								}
							});
						}
					}}
					ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
				/>
			</View>
		);
	};
	render() {
		return (
			<PageContainer title="答题赚钱" isTopNavigator>
				{this._renderCategoryList()}
			</PageContainer>
		);
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
