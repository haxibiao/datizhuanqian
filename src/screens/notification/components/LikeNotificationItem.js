/*
 * @Author: Gaoxuan
 * @Date:   2019-05-05 16:06:33
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Iconfont, UserTitle, Avatar, TouchFeedback, GenderLabel } from 'components';
import { Theme, PxFit, Tools } from 'utils';

class CommentNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	siwthType = notification => {
		if (Tools.syncGetter('like.comment', notification)) {
			this.content = { tips: '赞了我的评论', body: Tools.syncGetter('like.comment.content', notification) };
		} else {
			this.content = { tips: '赞了我的题目', body: Tools.syncGetter('like.question.description', notification) };
		}
	};

	render() {
		const { navigation, notification } = this.props;
		let user = Tools.syncGetter('like.user', notification);
		if (notification.like) {
			this.siwthType(notification);

			if (Tools.syncGetter('like.question', notification)) {
				return (
					<TouchFeedback
						style={styles.container}
						onPress={() => {
							navigation.navigate('Question', {
								question: Tools.syncGetter('like.question', notification)
							});
						}}
					>
						<TouchFeedback style={styles.header} onPress={() => navigation.navigate('User', { user })}>
							<Avatar source={{ uri: Tools.syncGetter('avatar', user) }} size={34} />
							<View style={styles.user}>
								<View style={styles.userTop}>
									<Text
										style={{
											color: Theme.black
										}}
									>
										{Tools.syncGetter('name', user)}
									</Text>
									<UserTitle user={user} />
									<GenderLabel user={user} />
								</View>

								<Text style={styles.commenTime}>
									{Tools.syncGetter('like.created_at', notification)} {this.content.tips}
								</Text>
							</View>
						</TouchFeedback>
						<View style={styles.bottom}>
							<Text>{this.content.body}</Text>
						</View>
					</TouchFeedback>
				);
			} else if (Tools.syncGetter('like.comment', notification)) {
				return (
					<TouchFeedback style={styles.container}>
						<TouchFeedback style={styles.header} onPress={() => navigation.navigate('User', { user })}>
							<Avatar source={{ uri: Tools.syncGetter('avatar', user) }} size={34} />
							<View style={styles.user}>
								<View style={styles.userTop}>
									<Text
										style={{
											color: Theme.black
										}}
									>
										{Tools.syncGetter('name', user)}
									</Text>
									<UserTitle user={user} />
									<GenderLabel user={user} />
								</View>

								<Text style={styles.commenTime}>
									{Tools.syncGetter('like.comment.time_ago', notification)} {this.content.tips}
								</Text>
							</View>
						</TouchFeedback>
						<View style={styles.bottom}>
							<Text>{this.content.body}</Text>
						</View>
					</TouchFeedback>
				);
			}
		} else {
			return null;
		}
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
