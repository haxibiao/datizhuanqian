/*
 * @flow
 * created by gaoxuan made in 2019-02-22 10:14:12
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
	ContentEnd,
	BasicModal
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { FavoritesQuery } from '../../graphql/user.graphql';
import { toggleFavoriteMutation } from '../../graphql/question.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';

class FavoritesItem extends Component {
	static defaultProps = {
		favorites: {}
	};

	render() {
		let {
			favorites: { question, created_at },
			navigation,
			openModal,
			index
		} = this.props;
		let { category, description } = question;

		return (
			<TouchableOpacity
				onPress={() => navigation.navigate('收藏详情列表', { index })}
				onLongPress={() => openModal(question.id)}
			>
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
			</TouchableOpacity>
		);
	}
}

class MyFavoritesScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true,
			modalVisible: false,
			question_id: null
		};
	}

	openFavoriteModal = id => {
		this.setState({ modalVisible: true, question_id: id });
	};

	closeFavoriteModal = () => {
		this.setState({ modalVisible: false, question_id: null });
	};

	favoriteQuestion = (toggleFavorite, id) => {
		toggleFavorite({ variables: { data: { favorable_id: id } } });
	};

	onCompleted = () => {
		this.closeFavoriteModal();
	};

	onError = err => {
		let str = err.toString().replace(/Error: GraphQL error: /, '');
		Methods.toast('操作失败', -100); //Toast错误信息  后端暂停服务需求
	};

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
							if (!(data && data.favorites && data.favorites.length > 0)) {
								return <BlankContent />;
							}
							return (
								<FlatList
									data={data.favorites}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<FavoritesItem
											favorites={item}
											navigation={navigation}
											openModal={this.openFavoriteModal}
											index={index}
										/>
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
														favorites: [...prev.favorites, ...fetchMoreResult.favorites]
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
					<Mutation
						mutation={toggleFavoriteMutation}
						onCompleted={this.onCompleted}
						onError={this.onError}
						refetchQueries={result => {
							return [{ query: FavoritesQuery }];
						}}
					>
						{toggleFavorite => {
							return (
								<BasicModal
									visible={this.state.modalVisible}
									handleVisible={this.closeFavoriteModal}
									customStyle={{
										width: 240,
										padding: 0,
										paddingTop: 20,
										borderRadius: 20,
										alignItems: 'center'
									}}
									header={<Text style={{ color: Colors.black, fontSize: 17 }}>确认取消收藏吗？</Text>}
								>
									<View style={styles.modalBody}>
										<TouchableOpacity style={styles.closeBtn} onPress={this.closeFavoriteModal}>
											<Text
												style={{
													fontSize: 15,
													color: Colors.grey
												}}
											>
												取消
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
											onPress={() =>
												this.favoriteQuestion(toggleFavorite, this.state.question_id)
											}
										>
											<Text
												style={{
													fontSize: 15,
													color: Colors.theme
												}}
											>
												确认
											</Text>
										</TouchableOpacity>
									</View>
								</BasicModal>
							);
						}}
					</Mutation>
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
	},
	modalBody: {
		flexDirection: 'row',
		alignItems: 'stretch',
		height: 40,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0'
	},
	closeBtn: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRightWidth: 1,
		borderRightColor: '#f0f0f0'
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(MyFavoritesScreen);
