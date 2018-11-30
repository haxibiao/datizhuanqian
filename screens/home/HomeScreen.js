import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, RefreshControl } from "react-native";

import { Header } from "../../components/Header";
import { DivisionLine, TabTop, LoadingMore, ContentEnd } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";
import PlateItem from "./PlateItem";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { CategoriesQuery } from "../../graphql/question.graphql";
import { Query } from "react-apollo";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}
	render() {
		const { plate, navigation, user, nextPlate } = this.props;
		return (
			<Screen header>
				<Header
					leftComponent={<Text />}
					customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
				/>
				<View style={styles.container}>
					<Query query={CategoriesQuery}>
						{({ data, error, loading, refetch, fetchMore }) => {
							if (error) return null;
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
									renderItem={({ item, index }) => <PlateItem plate={item} navigation={navigation} />}
									ListHeaderComponent={() => {
										return <TabTop user={user} />;
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
		user: store.users.user
	};
})(HomeScreen);
