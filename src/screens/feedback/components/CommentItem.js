/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 15:57:16
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';

import { Theme, Tools } from 'utils';

import { Iconfont, Avatar, UserTitle, GenderLabel } from 'components';

import FeedbackOverlay from './FeedbackOverlay';

import { graphql, compose, GQL } from 'apollo';

class CommentItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbackCommentVisible: false
		};
	}

	deleteComment = async () => {
		let result = {};
		const { navigation, item, feedback_id } = this.props;
		try {
			result = await this.props.deleteCommentMutation({
				variables: {
					id: item.id
				},
				refetchQueries: () => [
					{
						query: GQL.feedbackCommentsQuery,
						variables: {
							commentable_id: feedback_id,
							commentable_type: 'feedbacks'
						}
					},
					{
						query: GQL.feedbackQuery,
						variables: {
							id: feedback_id
						}
					}
				]
			});
		} catch (ex) {
			result.errors = result;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
		} else {
			Toast.show({ content: '删除成功' });
			FeedbackOverlay.hide();
		}
	};

	onSkip = () => {
		const { navigation, item } = this.props;
		navigation.navigate('ReportComment', { comment_id: item.id });
	};

	render() {
		const { navigation, item, replyComment, switchReplyType, user, feedback_id } = this.props;
		let { feedbackCommentVisible } = this.state;
		return (
			<TouchableOpacity
				style={styles.container}
				activeOpacity={1}
				onPress={() => {
					switchReplyType();
					replyComment(item);
				}}
			>
				<View style={styles.top}>
					<View style={styles.topLeft}>
						<TouchableOpacity onPress={() => navigation.navigate('User', { user: item.user })}>
							<Avatar source={{ uri: item.user.avatar }} size={34} borderStyle={{}} />
						</TouchableOpacity>
						<View style={styles.user}>
							<View style={styles.row}>
								<Text
									style={{
										color: item.user.is_admin ? Theme.secondaryColor : Theme.black
									}}
								>
									{item.user.name}
								</Text>
								<UserTitle user={item.user} />
								<GenderLabel user={item.user} />
							</View>
							<View style={styles.row}>
								<Text style={styles.time}># {item.rank}</Text>
								<View
									style={{
										height: 9,
										width: 0.4,
										backgroundColor: Theme.grey,
										marginHorizontal: 5
									}}
								/>
								<Text style={styles.time}>{item.time_ago}</Text>
							</View>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => {
							FeedbackOverlay.show(
								user,
								switchReplyType,
								replyComment,
								item,
								feedback_id,
								this.deleteComment,
								this.onSkip
							);
						}}
						style={{ padding: 5 }}
					>
						<Iconfont name={'more-horizontal'} size={14} />
					</TouchableOpacity>
				</View>

				<View style={{ marginTop: 10, marginLeft: 44 }}>
					{item.parent_comment && (
						<View style={[styles.row, { paddingBottom: 15 }]}>
							<View style={styles.tag} />
							<Text style={styles.text} numberOfLines={1}>
								{`引用  #${item.parent_comment.rank}  ${item.parent_comment.user.name}的评论\n`}
							</Text>
						</View>
					)}

					<Text style={{ color: Theme.black, fontSize: 15 }}>{item.content}</Text>
					{item.images.map((image, index) => {
						let width = image.width;
						let height = image.height;
						let padding = 103;
						let size = Tools.imageSize({ width, height, padding });
						return (
							<Image
								source={{ uri: image.path }}
								style={{
									width: size.width,
									height: size.height,
									marginTop: 10
								}}
								key={index}
							/>
						);
					})}
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomColor: Theme.lightBorder,
		borderBottomWidth: 0.5
	},
	top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	topLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	user: {
		paddingLeft: 10,
		justifyContent: 'space-between',
		height: 34
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	tag: {
		height: 18,
		width: 4,
		backgroundColor: '#dfe2e5'
	},
	text: {
		color: Theme.grey,
		fontSize: 15,
		paddingLeft: 10,
		height: 20
	},
	time: {
		fontSize: 11,
		color: Theme.grey,
		lineHeight: 16
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: Theme.lightBorder,
		paddingHorizontal: 7,
		paddingVertical: 3,
		borderRadius: 5,
		marginLeft: 8
	}
});

export default compose(graphql(GQL.deleteCommentMutation, { name: 'deleteCommentMutation' }))(CommentItem);
