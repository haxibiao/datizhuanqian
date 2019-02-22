/*
 * @flow
 * created by wyk made in 2019-02-15 10:14:12
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	Platform,
	View,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	RefreshControl
} from 'react-native';
import {
	DivisionLine,
	Header,
	Screen,
	Iconfont,
	LoadingError,
	Loading,
	BlankContent,
	LoadingMore,
	ContentEnd
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { FavoritesQuery } from '../../graphql/user.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';

class FavoritesItem extends Component {
	static defaultProps = {
		favorites: {}
	};

	render() {
		let {
			favorites: { question, created_at },
			navigation
		} = this.props;
		let { category, description } = question;

		return (
			<TouchableWithoutFeedback onPress={() => navigation.navigate('题目详情', { question })}>
				<View style={styles.favoritesItem}>
					<View style={styles.content}>
						<View style={{ flex: 1 }}>
							<Text style={styles.subjectText} numberOfLines={3}>
								{description}
							</Text>
						</View>
					</View>
					<View>
						<View style={styles.favorites}>
							<Text style={styles.favoritesText}>#{category.name}</Text>
							<Text style={styles.time}>{created_at}</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

class MyFavoritesScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		let { navigation } = this.props;
		return (
			<Screen header>
				<Header
					customStyle={{
						backgroundColor: Colors.theme,
						borderBottomWidth: 0,
						borderBottomColor: 'transparent'
					}}
				/>
				<View style={styles.container}>
					<Query query={FavoritesQuery} fetchPolicy="network-only">
						{({ data, loading, error, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (loading) return <Loading />;
							console.log('data', data);
							if (!(data && data.favorites && data.favorites.length > 0)) {
								return <BlankContent />;
							}
							return (
								<FlatList
									data={data.favorites}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<FavoritesItem favorites={item} navigation={navigation} />
									)}
									refreshControl={
										<RefreshControl
											refreshing={loading}
											onRefresh={refetch}
											colors={[Colors.theme]}
										/>
									}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (data.favorites) {
											fetchMore({
												variables: {
													offset: data.favorites.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (
														!(
															fetchMoreResult &&
															fetchMoreResult &&
															fetchMoreResult.favorites &&
															fetchMoreResult.favorites.length > 0
														)
													) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														user: Object.assign({}, prev, {
															favorites: [...prev.favorites, ...fetchMoreResult.favorites]
														})
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
										return (
											<View style={{ marginTop: -10 }}>
												{this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />}
											</View>
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
	},
	favoritesItem: {
		padding: 15,
		backgroundColor: '#fff',
		paddingBottom: 10,
		borderBottomWidth: 0.5,
		borderColor: '#f0f0f0'
	},
	categoryLabel: {
		alignSelf: 'auto',
		paddingHorizontal: 4,
		paddingVertical: 2,
		borderWidth: 0.5,
		borderRadius: 3,
		fontSize: 14,
		color: Colors.theme,
		borderColor: Colors.theme
	},
	content: {
		marginBottom: 10
	},
	subjectText: {
		fontSize: 16,
		lineHeight: 20,
		color: Colors.primaryFont
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 5,
		resizeMode: 'cover'
	},
	favorites: {
		marginTop: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	favoritesText: {
		fontSize: 13,
		color: Colors.theme
	},
	time: {
		fontSize: 13,
		color: Colors.grey
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(MyFavoritesScreen);
