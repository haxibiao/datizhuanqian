import React, { Component } from 'react';

import { StyleSheet, View, TouchableOpacity, FlatList, RefreshControl, Linking } from 'react-native';

import {
	Header,
	CheckUpdateModal,
	UpdateTipsModal,
	TabTop,
	LoadingMore,
	ContentEnd,
	Banner,
	Loading,
	PlateItem,
	CategoryCache,
	Iconfont
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { CategoriesQuery, QuestionQuery } from '../../graphql/question.graphql';
import { Query, withApollo, compose, graphql } from 'react-apollo';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handleUpdateModalVisible = this.handleUpdateModalVisible.bind(this);
		this.handForceUpdateModal = this.handForceUpdateModal.bind(this);
		this.changeVersionInfo = this.changeVersionInfo.bind(this);
		this.state = {
			fetchingMore: true,
			updateVisible: false,
			mustUpdateVisible: false,
			url: 'https://datizhuanqian.com?from=app',
			onlineVersion: '1.1.0'
		};
	}

	componentDidMount() {
		const { navigation, login, isUpdate, client, dispatch } = this.props;

		let auto = true;
		this.timer = setTimeout(() => {
			Methods.achieveUpdate(
				this.handleUpdateModalVisible,
				this.handForceUpdateModal,
				this.changeVersionInfo,
				isUpdate,
				this.props.login,
				auto
			);
		}, 5000);
		//等待APP 启动页加载完再开始执行更新提示

		this.didFocusSubscription = navigation.addListener('didFocus', payload => {
			let { users, client, dispatch, login } = this.props;
			if (login) {
				client
					.query({
						query: QuestionQuery,
						variables: {
							category_id: 1
						}
					})
					.then(({ data }) => {
						console.log(data);
					})
					.catch(error => {
						let info = error.toString().indexOf('登录');
						if (info > -1) {
							this.props.dispatch(actions.signOut());
							Methods.toast('您的身份信息已过期,请重新登录', -90);
						}
					});
			}
		});

		//当有用户seesion 过期时 ,清空redux 强制登录。
		//删除此段代码后 更换账号登录后无法fetchQuery的BUG会再出现。预计还是未真正的解决apollo cache的bug
	}

	render() {
		const { navigation, user, login } = this.props;
		let { updateVisible, isUpdate, mustUpdateVisible } = this.state;
		return (
			<View style={styles.container}>
				<Header
					headerLeft
					customStyle={{ backgroundColor: Colors.theme }}
					routeName={'答题赚钱'}
					// headerRight={
					// 	<TouchableOpacity
					// 		onPress={() => {
					// 			navigation.navigate("通知");
					// 		}}
					// 	>
					// 		<Iconfont name={"more-horizontal"} size={18} />
					// 	</TouchableOpacity>
					// } //上线隐藏功能
				/>
				{this._renderCategoryList()}
				<CheckUpdateModal
					visible={updateVisible}
					cancel={() => {
						this.handleUpdateModalVisible();
						this.props.dispatch(actions.changeUpdateTipsVersion(this.state.onlineVersion));
					}}
					handleVisible={this.handleUpdateModalVisible}
					tips={'发现新版本'}
					confirm={() => {
						this.handleUpdateModalVisible();
						this.openUrl(this.state.url);
					}}
				/>
				<UpdateTipsModal
					visible={mustUpdateVisible}
					openUrl={() => {
						this.openUrl(this.state.url);
					}}
					tips={'发现新版本'}
				/>
			</View>
		);
	}

	_renderCategoryList = () => {
		const {
			data,
			navigation,
			user,
			login,
			data: { loading, error, categories, refetch, fetchMore }
		} = this.props;
		if (error)
			return (
				<CategoryCache
					navigation={navigation}
					login={login}
					refetch={() => {
						refetch();
					}}
				/>
			);
		if (loading) return <Loading />;
		if (!(data && data.categories)) {
			return null;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<TabTop />
					<FlatList
						data={data.categories}
						refreshControl={
							<RefreshControl refreshing={loading} onRefresh={refetch} colors={[Colors.theme]} />
						}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item, index }) => (
							<PlateItem category={item} navigation={navigation} login={login} />
						)}
						ListHeaderComponent={() => {
							return <Banner />;
						}}
						onEndReachedThreshold={0.3}
						onEndReached={() => {
							if (data.categories) {
								fetchMore({
									variables: {
										offset: data.categories.length
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
												fetchingMore: false
											});
											return prev;
										}
										return Object.assign({}, prev, {
											categories: [...prev.categories, ...fetchMoreResult.categories]
										});
									}
								});
							} else {
								this.setState({
									fetchingMore: false
								});
							}
						}}
						ListFooterComponent={() => {
							return this.state.fetchingMore ? (
								<LoadingMore />
							) : (
								<ContentEnd content={'暂时没有更多分类~'} />
							);
						}}
					/>
				</View>
			);
		}
	};

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.data && nextProps.data.categories) {
			nextProps.dispatch(actions.categoryCache(nextProps.data.categories));
		}
		//启动APP的时候存入分类数据
	}

	componentWillUnmount() {
		this.didFocusSubscription.remove();
		this.timer && clearTimeout(this.timer);
	}

	handleUpdateModalVisible() {
		this.setState(prevState => ({
			updateVisible: !prevState.updateVisible
		}));
	}

	handForceUpdateModal() {
		this.setState(prevState => ({
			mustUpdateVisible: !prevState.mustUpdateVisible
		}));
	}

	openUrl(url) {
		Linking.openURL(url);
	}

	changeVersionInfo(url, version) {
		this.setState({
			url: url,
			onlineVersion: version
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login,
		isUpdate: store.users.isUpdate
	};
})(compose(graphql(CategoriesQuery, { options: props => ({ variables: { limit: 10 } }) }))(withApollo(HomeScreen)));
