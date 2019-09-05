/*
 * @flow
 * created by wyk made in 2019-03-28 14:38:24
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableWithoutFeedback, Text, Image, Animated } from 'react-native';
import { Player, TouchFeedback, Iconfont, Button } from 'components';
import { Theme, SCREEN_WIDTH, PxFit, Tools } from 'utils';

import { Mutation, compose, graphql, GQL } from 'apollo';

class FooterBar extends Component {
	constructor(props) {
		super(props);
		this.bounce = new Animated.Value(1);
		this.state = {
			favorited: props.question.favorite_status,
			liked: props.question.liked,
			count_likes: props.question.count_likes,
			count_comments: props.question.count_comments
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.question !== this.props.question) {
			this.setState({
				favorited: nextProps.question.favorite_status,
				liked: nextProps.question.liked,
				count_likes: nextProps.question.count_likes,
				count_comments: nextProps.question.count_comments
			});
		}
	}

	likeQuestion = () => {
		this.setState(
			prevState => ({
				liked: !prevState.liked,
				count_likes: prevState.liked ? --prevState.count_likes : ++prevState.count_likes
			}),
			() => this.bounceAnimation(this.state.liked)
		);
	};

	bounceAnimation = isLiked => {
		let { toggleLike, question } = this.props;
		try {
			toggleLike({
				variables: {
					likable_id: question.id,
					likable_type: 'QUESTION'
				}
			});
		} catch (error) {
			console.log('toggleLike error', error);
		}
		if (isLiked) {
			this.bounce.setValue(1);
			Animated.spring(this.bounce, {
				toValue: 1.2,
				friction: 2,
				tension: 40
			}).start();
		}
	};

	toggleFavorite = async () => {
		let { question, toggleFavorite } = this.props;
		this.setState(prevState => ({ favorited: !prevState.favorited }));
		toggleFavorite({
			variables: { data: { favorable_id: question.id } },
			refetchQueries: () => [
				{
					query: GQL.FavoritesQuery,
					fetchPolicy: 'network-only'
				}
			]
		});
	};

	render() {
		let { navigation, question, showComment, oSubmit, isOwn } = this.props;
		let { favorited, liked, count_likes, count_comments } = this.state;
		if (!isOwn && question.status !== 1) {
			return null;
		}
		let scale = this.bounce.interpolate({
			inputRange: [1, 1.1, 1.2],
			outputRange: [1, 1.25, 1]
		});
		return (
			<View style={styles.container}>
				<View style={styles.footerBar}>
					<View style={styles.tools}>
						<TouchFeedback style={styles.toolItem} onPress={this.toggleFavorite}>
							<View style={styles.iconWrap}>
								<Iconfont
									name={favorited ? 'collection-fill' : 'collection'}
									size={PxFit(21)}
									color={favorited ? Theme.primaryColor : Theme.defaultTextColor}
								/>
							</View>
							<Text
								style={[
									styles.itemName,
									{ color: favorited ? Theme.primaryColor : Theme.defaultTextColor }
								]}
							>
								{favorited ? '已收藏' : '收藏'}
							</Text>
						</TouchFeedback>
						<TouchFeedback style={styles.toolItem} onPress={showComment}>
							<View style={styles.iconWrap}>
								<Iconfont name="message" size={PxFit(18)} color={Theme.defaultTextColor} />
							</View>
							<Text style={styles.itemName}>
								评论{Tools.NumberFormat(count_comments) > 0 && ' ' + Tools.NumberFormat(count_comments)}
							</Text>
						</TouchFeedback>
						<TouchableWithoutFeedback onPress={Tools.throttle(this.likeQuestion, 400)}>
							<Animated.View style={[styles.toolItem, { transform: [{ scale: scale }] }]}>
								<View style={styles.iconWrap}>
									<Iconfont
										name={liked ? 'praise-fill' : 'praise'}
										size={PxFit(18)}
										color={liked ? Theme.primaryColor : Theme.defaultTextColor}
									/>
								</View>
								<Text
									style={[
										styles.itemName,
										{ color: liked ? Theme.primaryColor : Theme.defaultTextColor }
									]}
								>
									点赞{Tools.NumberFormat(count_likes) > 0 && ' ' + Tools.NumberFormat(count_likes)}
								</Text>
							</Animated.View>
						</TouchableWithoutFeedback>
					</View>
					<TouchFeedback
						style={[styles.button, { backgroundColor: '#969696' }]}
						onPress={oSubmit}
						disabled
						checkNetwork
					>
						<Text style={styles.buttonText}>{'仅浏览'}</Text>
					</TouchFeedback>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		backgroundColor: '#fff'
	},
	footerBar: {
		flexDirection: 'row',
		alignItems: 'stretch',
		height: PxFit(48)
	},
	tools: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
		borderTopWidth: PxFit(1),
		borderColor: Theme.borderColor
	},
	toolItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconWrap: {
		height: PxFit(30),
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemName: {
		fontSize: PxFit(12),
		color: Theme.defaultTextColor
	},
	button: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		fontSize: PxFit(14),
		color: '#fff',
		fontWeight: '500',
		letterSpacing: PxFit(4)
	}
});

export default compose(
	graphql(GQL.toggleLikeMutation, { name: 'toggleLike' }),
	graphql(GQL.toggleFavoriteMutation, { name: 'toggleFavorite' })
)(FooterBar);
