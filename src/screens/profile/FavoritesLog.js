/*
 * @flow
 * created by wyk made in 2019-03-22 16:29:20
 */
'use strict';

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
	Animated
} from 'react-native';
import {
	PageContainer,
	Iconfont,
	TouchFeedback,
	CustomRefreshControl,
	ItemSeparator,
	ListFooter,
	Row,
	PlaceholderImage
} from 'components';
import { Theme, PxFit, Config, Tools, SCREEN_WIDTH } from 'utils';
import { compose, Query, Mutation, graphql, GQL } from 'apollo';

class FavoritesLog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			finished: false
		};
	}

	cancelFavorite = async (id, callback) => {
		try {
			console.log('cancelFavorite', id);
			callback && callback();
			await this.props.cancelFavorite({ variables: { data: { favorable_id: id } } });
			Toast.show({ content: '取消收藏成功' });
		} catch (err) {
			let str = err.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: '取消收藏失败' });
		}
	};

	render() {
		let { navigation } = this.props;

		return (
			<Query query={GQL.FavoritesQuery} fetchPolicy="network-only">
				{({ data, loading, error, refetch, fetchMore }) => {
					let favorites = Tools.syncGetter('favorites', data);
					let empty = favorites && favorites.length === 0;
					loading = !favorites;
					return (
						<PageContainer title="我的收藏" refetch={refetch} loading={loading} empty={empty}>
							<FlatList
								contentContainerStyle={styles.container}
								data={favorites}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<QuestionItem
										favorite={item}
										navigation={navigation}
										cancelFavorite={this.cancelFavorite}
									/>
								)}
								refreshControl={
									<CustomRefreshControl
										onRefresh={refetch}
										reset={() => this.setState({ finished: false })}
									/>
								}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: favorites.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.favorites &&
													fetchMoreResult.favorites.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												favorites: [...prev.favorites, ...fetchMoreResult.favorites]
											});
										}
									});
								}}
								ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
							/>
						</PageContainer>
					);
				}}
			</Query>
		);
	}
}

class QuestionItem extends Component {
	static defaultProps = {
		question: {}
	};

	constructor(props) {
		super(props);
		this.state = {
			hidden: false
		};
		this._animated = new Animated.Value(1);
	}

	fadeOut = () => {
		Animated.timing(this._animated, {
			toValue: 0,
			duration: 300
		}).start(() => this.onRemove());
	};

	onRemove = () => {
		this.setState({ hidden: true });
	};

	render() {
		let {
			favorite: { question, created_at },
			navigation,
			cancelFavorite
		} = this.props;
		let { id, category, image, description, video, count } = question;
		if (this.state.hidden) {
			return null;
		}
		const animateStyles = {
			opacity: this._animated,
			transform: [
				{ scale: this._animated },
				{
					rotate: this._animated.interpolate({
						inputRange: [0, 1],
						outputRange: ['90deg', '0deg'],
						extrapolate: 'clamp'
					})
				}
			]
		};
		return (
			<Animated.View style={animateStyles}>
				<TouchableWithoutFeedback onPress={() => navigation.navigate('Question', { question })}>
					<View style={styles.questionItem}>
						<View style={styles.questionCategory}>
							<Text style={styles.categoryText} numberOfLines={1}>
								#{category.name}
							</Text>
							<Text style={styles.metaText}>{Tools.NumberFormat(count) + '人答过'}</Text>
						</View>
						<View style={{ padding: PxFit(Theme.itemSpace) }}>
							<View style={styles.questionContent}>
								<View style={{ flex: 1 }}>
									<Text style={styles.subjectText} numberOfLines={3}>
										{description}
									</Text>
								</View>
								{image && <PlaceholderImage source={{ uri: image.path }} style={styles.image} />}
								{video && (
									<View style={[styles.image, { backgroundColor: '#201e33' }]}>
										<Image
											source={{ uri: video.cover }}
											style={{ width: PxFit(60), height: PxFit(60) }}
										/>
										<Iconfont
											name="paused"
											size={PxFit(24)}
											color="#fff"
											style={styles.fullScreen}
										/>
									</View>
								)}
							</View>
							<View style={styles.meta}>
								<Text style={styles.metaText}>{created_at}</Text>
								<TouchFeedback onPress={() => cancelFavorite(id, this.fadeOut)}>
									<Text style={styles.metaText}>取消收藏</Text>
								</TouchFeedback>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: PxFit(Theme.itemSpace),
		backgroundColor: '#f9f9f9'
	},
	questionItem: {
		marginBottom: PxFit(Theme.itemSpace),
		borderRadius: PxFit(5),
		backgroundColor: '#fff'
	},
	questionCategory: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: PxFit(10),
		paddingHorizontal: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: '#f0f0f0'
	},
	questionContent: { flexDirection: 'row', alignItems: 'center', marginBottom: PxFit(Theme.itemSpace) },
	categoryText: {
		fontSize: PxFit(14),
		color: Theme.primaryColor,
		borderColor: Theme.primaryColor
	},
	subjectText: {
		fontSize: PxFit(15),
		lineHeight: PxFit(20),
		color: Theme.defaultTextColor
	},
	image: {
		width: PxFit(60),
		height: PxFit(60),
		borderRadius: PxFit(5),
		resizeMode: 'cover',
		marginLeft: PxFit(12),
		overflow: 'hidden'
	},
	fullScreen: {
		position: 'absolute',
		top: PxFit(18),
		left: PxFit(18),
		bottom: 0,
		right: 0
	},
	meta: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	metaText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	}
});

export default compose(
	graphql(GQL.toggleFavoriteMutation, {
		name: 'cancelFavorite'
	})
)(FavoritesLog);
