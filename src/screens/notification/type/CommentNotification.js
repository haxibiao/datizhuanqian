import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Iconfont, UserTitle, Avatar } from '../../../components';
import Colors from '../../../constants/Colors';

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
					<Avatar uri={notification.comment.user.avatar} size={34} />
					<View style={styles.user}>
						<View style={styles.userTop}>
							<Text
								style={{
									color: Colors.black
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
		paddingVertical: 15,
		paddingHorizontal: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.lightBorder
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	user: {
		paddingLeft: 10,
		justifyContent: 'space-between',
		height: 34
	},
	userTop: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	commenTime: {
		fontSize: 11,
		color: Colors.grey,
		lineHeight: 16
	},
	center: {
		marginTop: 10,
		marginLeft: 44
	},
	content: {
		color: Colors.black,
		fontSize: 15
	},

	bottom: {
		backgroundColor: Colors.lightBorder,
		padding: 6,
		marginTop: 10,
		marginLeft: 44
	}
});

export default CommentNotification;
