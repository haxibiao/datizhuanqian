import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	FlatList,
	Image,
	RefreshControl,
	Linking,
	BackHandler
} from 'react-native';

import {
	Header,
	CheckUpdateModal,
	UpdateTipsModal,
	DivisionLine,
	TabTop,
	LoadingMore,
	ContentEnd,
	LoadingError,
	Banner,
	Loading
} from '../../components';
import { Colors, Config, Divice, Methods } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

import Screen from '../Screen';
import PlateItem from './PlateItem';
import CategoryCache from './CategoryCache';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { CategoriesQuery, QuestionQuery } from '../../graphql/question.graphql';
import { Query, withApollo } from 'react-apollo';

import codePush from 'react-native-code-push';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handleUpdateModalVisible = this.handleUpdateModalVisible.bind(this);
		this.handForceUpdateModal = this.handForceUpdateModal.bind(this);
		this.state = {
			fetchingMore: true,
			updateVisible: false,
			mustUpdateVisible: false,
			isMust: false,
			versionInfo: null,
			categoryCache: ''
		};
	}

	componentDidMount() {
		const { navigation, login, isUpdate, client, dispatch } = this.props;

		let auto = true;
		this.timer = setTimeout(() => {
			Methods.achieveUpdate(
				this.handleUpdateModalVisible,
				this.handForceUpdateModal,
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
				console.log('home client', client);
			}
		});

		client
			.query({
				query: CategoriesQuery
			})
			.then(({ data }) => {
				console.log('data CategoriesQuery', data);
				this.props.dispatch(actions.categoryCache(data.categories));
			})
			.catch(error => {});

		//当有用户seesion 过期时 ,清空redux 强制登录。
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
		console.log('uri', url);
		Linking.openURL(url);
	}

	/*	componentDidMount() {
		const { navigation } = this.props;
		Linking.getInitialURL()
			.then(url => {
				if (url) {
					navigation.navigate("回答"); //question id
				}
			})
			.catch(err => console.error("An error occurred", err));
	}*/

	render() {
		const { navigation, user, nextPlate, login } = this.props;
		let { updateVisible, isUpdate, mustUpdateVisible } = this.state;

		return (
			<Screen header>
				<Header
					headerLeft
					customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
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

				<View style={styles.container}>
					<Query query={CategoriesQuery}>
						{({ data, error, loading, refetch, fetchMore }) => {
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
							if (!(data && data.categories)) return null;

							return (
								<View style={{ flex: 1 }}>
									<TabTop />
									<FlatList
										data={data.categories}
										refreshControl={
											<RefreshControl
												refreshing={loading}
												onRefresh={refetch}
												colors={[Colors.theme]}
											/>
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
															categories: [
																...prev.categories,
																...fetchMoreResult.categories
															]
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
						}}
					</Query>
				</View>
				<CheckUpdateModal
					visible={updateVisible}
					cancel={() => {
						this.handleUpdateModalVisible();
						this.props.dispatch(actions.cancelUpdate(true));
					}}
					handleVisible={this.handleUpdateModalVisible}
					tips={'发现新版本'}
					confirm={() => {
						this.handleUpdateModalVisible();
						this.openUrl('https://datizhuanqian.com/storage/apks/datizhuanqian.apk');
					}}
				/>
				<UpdateTipsModal
					visible={mustUpdateVisible}
					openUrl={() => {
						this.openUrl('https://datizhuanqian.com/storage/apks/datizhuanqian.apk');
					}}
					tips={'发现新版本'}
				/>
			</Screen>
		);
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
})(withApollo(HomeScreen));
