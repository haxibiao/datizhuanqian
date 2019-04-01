/*
 * @flow
 * created by wyk made in 2019-03-29 16:41:46
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { TouchFeedback, Iconfont, Center, SafeText, Avatar, Row, PullChooser } from '../../../components';
import { Theme, PxFit, WPercent, Tools } from '../../../utils';
import { toggleLikeMutation } from '../../../assets/graphql/feedback.graphql';
import { compose, graphql, Query, Mutation } from 'react-apollo';
import { Provider, connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

type replyComment = { id: string, body: any, user: Object, count_likes: boolean, liked: boolean };
type Props = {
	comment: replyComment
};
class CommentItem extends Component<Props> {
	constructor(props) {
		super(props);
		this.comment = props.comment;
		this.state = {
			liked: this.comment.liked,
			count_likes: this.comment.count_count_likes,
			bounce: new Animated.Value(1)
		};
		this._animated = new Animated.Value(0);
	}

	componentDidMount() {
		Animated.timing(this._animated, {
			toValue: 1,
			duration: 250
		}).start();
	}

	likeComment = () => {
		this.setState(
			prevState => ({
				liked: !prevState.liked,
				count_likes: prevState.liked ? --prevState.count_likes : ++prevState.count_likes
			}),
			() => this.bounceAnimation(this.state.liked)
		);
	};

	bounceAnimation = isLiked => {
		try {
			this.props.toggleLikeMutation({
				variables: {
					likable_id: this.comment.id,
					likable_type: 'COMMENT'
				}
			});
		} catch (error) {
			console.log('toggleLikeMutation error', error);
		}
		if (isLiked) {
			let { bounce } = this.state;
			bounce.setValue(1);
			Animated.spring(bounce, {
				toValue: 1.2,
				friction: 2,
				tension: 40
			}).start();
		}
	};

	onLongPress = () => {
		PullChooser.show([
			{
				title: '举报',
				onPress: () => null
			}
		]);
	};

	render() {
		let { comment, navigation } = this.props;
		let { liked, count_likes, bounce } = this.state;
		let scale = bounce.interpolate({
			inputRange: [1, 1.1, 1.2],
			outputRange: [1, 1.25, 1]
		});
		const animateStyles = {
			opacity: this._animated,
			transform: [
				{
					translateY: this._animated.interpolate({
						inputRange: [0, 1],
						outputRange: [-100, 0],
						extrapolate: 'clamp'
					})
				}
			]
		};
		return (
			<Animated.View style={[styles.comment, animateStyles]}>
				<TouchFeedback onPress={() => navigation.navigate('User', { user: comment.user })}>
					<Avatar source={comment.user.avatar} size={PxFit(36)} />
				</TouchFeedback>
				<View style={{ flex: 1, marginLeft: PxFit(12) }}>
					<View style={styles.profile}>
						<View>
							<SafeText style={styles.name}>{comment.user.name}</SafeText>
							<SafeText style={styles.timeAgo}>{comment.time_ago}</SafeText>
						</View>
						<Row>
							<Animated.View style={{ transform: [{ scale: scale }] }}>
								<TouchFeedback style={styles.touchItem} onPress={Tools.throttle(this.likeComment, 400)}>
									<Iconfont
										name={liked ? 'like-fill' : 'like'}
										size={PxFit(20)}
										color={Theme.primaryColor}
									/>
								</TouchFeedback>
							</Animated.View>
							{count_likes > 0 && <SafeText style={styles.countLikes}>{count_likes}</SafeText>}
						</Row>
					</View>
					<View>
						{comment.body && (
							<Text style={styles.bodyText} numberOfLines={3}>
								{comment.body}
							</Text>
						)}
					</View>
				</View>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	comment: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: PxFit(Theme.itemSpace)
	},
	profile: {
		flex: 1,
		height: PxFit(40),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	touchItem: {
		width: PxFit(36),
		justifyContent: 'center',
		alignItems: 'center'
	},
	name: {
		fontSize: PxFit(14),
		fontWeight: '200',
		color: Theme.secondaryTextColor
	},
	timeAgo: {
		marginTop: PxFit(6),
		fontSize: PxFit(12),
		fontWeight: '200',
		color: Theme.tintTextColor
	},
	countLikes: {
		fontSize: PxFit(12),
		fontWeight: '200',
		color: Theme.primaryColor
	},
	bodyText: {
		marginTop: PxFit(10),
		fontSize: PxFit(16),
		lineHeight: PxFit(22),
		fontWeight: '300',
		color: Theme.defaultTextColor
	},
	linkText: {
		lineHeight: PxFit(22),
		color: Theme.linkColor
	},
	replyCommentsContainer: {
		marginTop: PxFit(10),
		padding: PxFit(12),
		backgroundColor: Theme.groundColour,
		borderRadius: PxFit(6)
	},
	replyBodyText: {
		fontSize: PxFit(14),
		lineHeight: PxFit(18),
		color: Theme.secondaryTextColor
	}
});

export default compose(
	withNavigation,
	graphql(toggleLikeMutation, { name: 'toggleLikeMutation' }),
	connect(store => ({ user: store.users.user }))
)(CommentItem);
