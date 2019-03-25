/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:48
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Iconfont, PageContainer, Avatar, RedDot } from '../../components';
import { Theme, PxFit } from '../../utils';

import { connect } from 'react-redux';
import { userUnreadQuery } from '../../assets/graphql/notification.graphql';
import { Query } from 'react-apollo';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			LOGO: require('../../assets/images/logo.png')
		};
	}

	render() {
		let { navigation, user } = this.props;
		return (
			<PageContainer title="消息中心" white>
				<TouchableOpacity
					style={styles.item}
					onPress={() => {
						navigation.navigate('SystemNotification');
					}}
				>
					<Avatar source={this.state.LOGO} size={48} />
					<View style={styles.itemRight}>
						<Text style={styles.name}>系统通知</Text>
						<Query query={userUnreadQuery} variables={{ id: user.id }}>
							{({ data, error }) => {
								if (error) return null;
								if (!(data && data.user)) return null;
								if (
									data.user.unread_notifications_count -
									data.user.unread_comment_notifications_count -
									data.user.unread_user_follow_notifications_count
								) {
									return (
										<RedDot
											count={
												data.user.unread_notifications_count -
												data.user.unread_comment_notifications_count
											}
										/>
									);
								} else {
									return <Iconfont name={'right'} size={16} />;
								}
							}}
						</Query>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.item}
					onPress={() => {
						navigation.navigate('CommentNotification');
					}}
				>
					<View style={styles.CommentIcon}>
						<Iconfont name={'notification'} size={23} color={Theme.white} />
					</View>
					<View style={styles.itemRight}>
						<Text style={styles.name}>评论</Text>
						<Query query={userUnreadQuery} variables={{ id: user.id }}>
							{({ data, error }) => {
								if (error) return null;
								if (!(data && data.user)) return null;
								if (data.user.unread_comment_notifications_count) {
									return <RedDot count={data.user.unread_comment_notifications_count} />;
								} else {
									return <Iconfont name={'right'} size={16} />;
								}
							}}
						</Query>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.item}
					onPress={() => {
						navigation.navigate('FansNotification');
					}}
				>
					<View style={styles.FansIcon}>
						<Iconfont name={'fans'} size={23} color={Theme.white} />
					</View>
					<View style={styles.itemRight}>
						<Text style={styles.name}>粉丝</Text>
						<Query query={userUnreadQuery} variables={{ id: user.id }}>
							{({ data, error }) => {
								if (error) return null;
								if (!(data && data.user)) return null;
								if (data.user.unread_user_follow_notifications_count) {
									return <RedDot count={data.user.unread_user_follow_notifications_count} />;
								} else {
									return <Iconfont name={'right'} size={16} />;
								}
							}}
						</Query>
					</View>
				</TouchableOpacity>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.lightBorder
	},
	name: {
		fontSize: PxFit(16),
		color: Theme.black
	},
	itemRight: {
		marginLeft: PxFit(10),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder,
		paddingVertical: PxFit(25),
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	item: {
		flexDirection: 'row',
		paddingHorizontal: PxFit(15),
		alignItems: 'center'
	},
	CommentIcon: {
		backgroundColor: Theme.weixin,
		padding: PxFit(12),
		borderRadius: PxFit(30)
	},
	FansIcon: {
		backgroundColor: '#68afff',
		padding: PxFit(12),
		borderRadius: PxFit(30)
	}
});

export default connect(store => {
	return { user: store.users.user };
})(index);
