/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:52:08
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Iconfont, UserTitle, Avatar } from '../../../components';
import { Theme, PxFit } from '../../../utils';

class CommentNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, notification } = this.props;
		return (
			<TouchableOpacity
				style={styles.container}
				onPress={() => {
					navigation.navigate('反馈详情', {
						feedback_id: notification.comment.feedback.id
					});
				}}
			>
				<View style={styles.header}>
					<Avatar source={{ uri: notification.comment.user.avatar }} size={34} />
					<View style={styles.user}>
						<View style={styles.userTop}>
							<Text
								style={{
									color: Theme.black
								}}
							>
								{notification.comment.user.name}
							</Text>
							<UserTitle user={notification.comment.user} />
						</View>

						<Text style={styles.commenTime}>
							{notification.comment.time_ago}
							{notification.type == 'FEEDBACK_COMMENT' ? '  回复了我的反馈' : '  引用了我的评论'}
						</Text>
					</View>
				</View>
				<View style={styles.center}>
					<Text style={styles.content}>{notification.comment.content}</Text>
				</View>
				<View style={styles.bottom}>
					<Text>
						{notification.type == 'FEEDBACK_COMMENT'
							? notification.comment.feedback.title
							: notification.comment.parent_comment.content}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: PxFit(15),
		paddingHorizontal: PxFit(10),
		backgroundColor: Theme.white,
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	user: {
		paddingLeft: PxFit(10),
		justifyContent: 'space-between',
		height: PxFit(34)
	},
	userTop: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	commenTime: {
		fontSize: PxFit(11),
		color: Theme.grey,
		lineHeight: PxFit(16)
	},
	center: {
		marginTop: PxFit(10),
		marginLeft: PxFit(44)
	},
	content: {
		color: Theme.black,
		fontSize: PxFit(15)
	},

	bottom: {
		backgroundColor: Theme.lightBorder,
		padding: PxFit(6),
		marginTop: PxFit(10),
		marginLeft: PxFit(44)
	}
});

export default CommentNotification;
