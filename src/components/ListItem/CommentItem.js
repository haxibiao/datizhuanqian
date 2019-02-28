import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';

import { Colors } from '../../constants';
import { Methods } from '../../helpers';
import { Iconfont } from '../utils/Fonts';
import Avatar from '../Universal/Avatar';
import FeedbackCommentModal from '../Modal/FeedbackCommentModal';
import PropDetailsModal from '../Modal/PropDetailsModal';
import UserTitle from '../Universal/UserTitle';

class CommentItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbackCommentVisible: false,
			images: [
				// { url: 'http://cos.qunyige.com/storage/image/14976.jpg', width: 900, height: 568 },
				// { url: 'https://ww2.sinaimg.cn/bmiddle/9bbc284bgy1g0c5aaqm9sj20ia0rf125.jpg', width: 400, height: 660 }
			]
		};
	}
	render() {
		const { navigation, item, replyComment, switchKeybord, user, feedback_id } = this.props;
		let { feedbackCommentVisible } = this.state;

		return (
			<TouchableOpacity
				style={styles.container}
				activeOpacity={1}
				onPress={() => {
					switchKeybord();
					replyComment(item);
				}}
			>
				<View style={styles.top}>
					<View style={styles.topLeft}>
						<Avatar uri={item.user.avatar} size={34} borderStyle={{}} />
						<View style={styles.user}>
							<View style={styles.row}>
								<Text
									style={{
										color: item.user.is_admin ? Colors.themeRed : Colors.black
									}}
								>
									{item.user.name}
								</Text>
								<UserTitle user={item.user} />
							</View>
							<View style={styles.row}>
								<Text style={styles.time}># {item.rank}</Text>
								<View
									style={{
										height: 9,
										width: 0.4,
										backgroundColor: Colors.grey,
										marginHorizontal: 5
									}}
								/>
								<Text style={styles.time}>{item.time_ago}</Text>
							</View>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => {
							this.setState({
								feedbackCommentVisible: !feedbackCommentVisible
							});
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

					<Text style={{ color: Colors.black, fontSize: 15 }}>{item.content}</Text>
					{item.images.map((image, index) => {
						let width = image.width;
						let height = image.height;
						let padding = 103;
						let size = Methods.imageSize({ width, height, padding });
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
				<FeedbackCommentModal
					visible={feedbackCommentVisible}
					handleVisible={() => {
						this.FeedbackCommentModalVisible();
					}}
					switchKeybord={switchKeybord}
					replyComment={replyComment}
					comment={item}
					user={user}
					feedback_id={feedback_id}
				/>
			</TouchableOpacity>
		);
	}

	FeedbackCommentModalVisible() {
		this.setState(prevState => ({
			feedbackCommentVisible: !prevState.feedbackCommentVisible
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomColor: Colors.lightBorder,
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
		color: Colors.grey,
		fontSize: 15,
		paddingLeft: 10,
		height: 20
	},
	time: {
		fontSize: 11,
		color: Colors.grey,
		lineHeight: 16
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: Colors.lightBorder,
		paddingHorizontal: 7,
		paddingVertical: 3,
		borderRadius: 5,
		marginLeft: 8
	}
});

export default CommentItem;
