import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, RefreshControl, Linking } from "react-native";

import { Header } from "../../components/Header";
import { DivisionLine, TabTop, LoadingMore, ContentEnd, LoadingError, Banner } from "../../components/Universal";
import { Colors, Config, Divice, Methods } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";
import PlateItem from "./PlateItem";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { CategoriesQuery, QuestionQuery } from "../../graphql/question.graphql";
import { Query, withApollo } from "react-apollo";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	componentDidMount() {
		const { navigation } = this.props;
		this.didFocusSubscription = navigation.addListener("didFocus", payload => {
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
						let info = error.toString().indexOf("登录");
						if (info > -1) {
							this.props.dispatch(actions.signOut());
							Methods.toast("您的身份信息已过期,请重新登录", -90);
						}
					});
			}
		});
	}

	componentWillUnmount() {
		this.didFocusSubscription.remove();
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
		const { plate, navigation, user, nextPlate, login } = this.props;
		return (
			<Screen header>
				<Header
					leftComponent={<Text />}
					customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
					routeName={"答题赚钱"}
					rightComponent={
						<TouchableOpacity
							onPress={() => {
								navigation.navigate("通知");
							}}
						>
							<Iconfont name={"more-horizontal"} size={18} />
						</TouchableOpacity>
					}
				/>

				<View style={styles.container}>
					<TabTop />
					<Query query={CategoriesQuery}>
						{({ data, error, loading, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.categories)) return null;
							return (
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
										<PlateItem plate={item} navigation={navigation} login={login} />
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
											<ContentEnd content={"暂时没有更多分类~"} />
										);
									}}
								/>
							);
						}}
					</Query>
				</View>
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
		plate: store.question.plate,
		user: store.users.user,
		login: store.users.login
	};
})(withApollo(HomeScreen));
