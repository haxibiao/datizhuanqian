/*
 * @flow
 * created by wyk made in 2019-03-29 16:45:06
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

import { Avatar, Iconfont, FollowButton } from '../../../components';
import { Theme, PxFit } from '../../../utils';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { Storage, ItemKeys } from '../../../store/localStorage';

import { Query, ApolloClient, withApollo } from 'react-apollo';

class UserProfile extends Component {
	render() {
		let { user } = this.props;
		return (
			<View style={styles.userInfoContainer}>
				<View style={styles.main}>
					<Avatar source={user.avatar} size={PxFit(90)} style={styles.userAvatar} />
					<View style={styles.userInfo}>
						<View style={styles.metaWrap}>
							<View style={styles.metaItem}>
								<Text style={styles.metaCount} numberOfLines={1}>
									{user.level ? user.level.level : 0}
								</Text>
								<Text style={styles.metaLabel} numberOfLines={1}>
									等级
								</Text>
							</View>
							<View style={styles.metaItem}>
								<Text style={styles.metaCount} numberOfLines={1}>
									{user.follow_users_count || 0}
								</Text>
								<Text style={styles.metaLabel} numberOfLines={1}>
									关注
								</Text>
							</View>
							<View style={styles.metaItem}>
								<Text style={styles.metaCount} numberOfLines={1}>
									{user.followers_count || 0}
								</Text>
								<Text style={styles.metaLabel} numberOfLines={1}>
									粉丝
								</Text>
							</View>
						</View>
						<FollowButton
							id={user.id}
							followedStatus={user.followed_user_status}
							style={{
								height: PxFit(32),
								borderRadius: PxFit(16),
								marginTop: PxFit(Theme.itemSpace)
							}}
							titleStyle={{ fontSize: PxFit(15), letterSpacing: 5 }}
						/>
					</View>
				</View>
				<View style={styles.bottom}>
					<Text style={styles.introduction} numberOfLines={2}>
						{user.introduction || '这个人很神秘，什么介绍都没有'}
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	userInfoContainer: {
		padding: PxFit(Theme.itemSpace),
		backgroundColor: '#fff'
	},
	main: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userInfo: {
		flex: 1,
		marginLeft: PxFit(30)
	},
	metaWrap: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
		maxHeight: PxFit(60)
	},
	metaItem: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: PxFit(5),
		marginTop: PxFit(5)
	},
	metaCount: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		fontWeight: '500'
	},
	metaLabel: {
		fontSize: PxFit(13),
		color: Theme.defaultTextColor
	},
	bottom: {
		marginTop: PxFit(20),
		marginBottom: PxFit(5)
	},
	introduction: {
		fontSize: PxFit(13),
		color: Theme.defaultTextColor
	}
});

export default UserProfile;
