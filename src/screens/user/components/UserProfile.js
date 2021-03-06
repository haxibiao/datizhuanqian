/*
 * @flow
 * created by wyk made in 2019-03-29 16:45:06
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

import { Avatar, Iconfont, FollowButton, Button, TouchFeedback, Row } from 'components';
import { Theme, PxFit } from 'utils';

import { Query, ApolloClient, withApollo } from 'react-apollo';
import { StackActions } from 'react-navigation';
import { app } from 'store';

class UserProfile extends Component {
	navigationAction = (bool: false) => {
		let { user } = this.props;
		return StackActions.push({
			routeName: 'UserSociety',
			params: {
				user,
				follower: bool
			}
		});
	};

	render() {
		let { user, orderByHot, switchOrder, hasQuestion, navigation } = this.props;
		let isSelf = app.me.id === user.id;
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
							<TouchFeedback
								style={styles.metaItem}
								onPress={() => navigation.dispatch(this.navigationAction())}
							>
								<Text style={styles.metaCount} numberOfLines={1}>
									{user.follow_users_count || 0}
								</Text>
								<Text style={styles.metaLabel} numberOfLines={1}>
									关注
								</Text>
							</TouchFeedback>
							<TouchFeedback
								style={styles.metaItem}
								onPress={() => navigation.dispatch(this.navigationAction(true))}
							>
								<Text style={styles.metaCount} numberOfLines={1}>
									{user.followers_count || 0}
								</Text>
								<Text style={styles.metaLabel} numberOfLines={1}>
									粉丝
								</Text>
							</TouchFeedback>
						</View>
						{isSelf ? (
							<Button
								style={StyleSheet.flatten([styles.button, { borderWidth: PxFit(1) }])}
								onPress={() => navigation.navigate('EditProfile', { user })}
							>
								<Text style={styles.editText}>编辑资料</Text>
							</Button>
						) : (
							<FollowButton
								id={user.id}
								followedStatus={user.followed_user_status}
								style={styles.button}
								titleStyle={{ fontSize: PxFit(15), letterSpacing: 5 }}
							/>
						)}
					</View>
				</View>
				<View style={styles.bottom}>
					{user.is_admin ? (
						<View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -6, paddingBottom: 10 }}>
							<Image
								source={require('../../../assets/images/admin.png')}
								style={{ height: PxFit(13), width: PxFit(13), marginHorizontal: PxFit(5) }}
							/>
							<Text style={styles.introduction} numberOfLines={1}>
								{user.is_admin ? '答题赚钱 官方账号' : user.profile.sub_name}
							</Text>
						</View>
					) : null}

					{user.profile.sub_name ? (
						<View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -6, paddingBottom: 10 }}>
							<Image
								source={require('../../../assets/images/official.png')}
								style={{ height: PxFit(13), width: PxFit(13), marginHorizontal: PxFit(5) }}
							/>
							<Text style={styles.introduction} numberOfLines={1}>
								{user.profile.sub_name}
							</Text>
						</View>
					) : null}

					<View>
						<Text style={styles.introduction} numberOfLines={2}>
							{user.profile.introduction || '这个人很神秘，什么介绍都没有'}
						</Text>
					</View>
					<View style={styles.labels}>
						{user.gender === 0 && (
							<View style={styles.label}>
								<Text style={styles.labelText}>男生</Text>
							</View>
						)}
						{user.gender === 1 && (
							<View style={styles.label}>
								<Text style={styles.labelText}>女生</Text>
							</View>
						)}
						{user.profile.age > 0 && (
							<View style={styles.label}>
								<Text style={styles.labelText}>{user.profile.age}</Text>
							</View>
						)}
					</View>
				</View>
				{hasQuestion && (
					<View style={styles.answerTitle}>
						<Text style={styles.greyText}>{isSelf ? '我' : 'TA'}出的题目</Text>
						<TouchFeedback onPress={switchOrder} style={{ paddingVertical: PxFit(5) }}>
							<Row>
								<Text style={[styles.orderText, orderByHot && { color: Theme.secondaryColor }]}>
									{orderByHot ? '热门' : '最新'}
								</Text>
								<Iconfont
									name="sort"
									size={PxFit(15)}
									style={{ marginTop: PxFit(1) }}
									color={orderByHot ? Theme.secondaryColor : Theme.correctColor}
								/>
							</Row>
						</TouchFeedback>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	userInfoContainer: {
		padding: PxFit(Theme.itemSpace),
		paddingBottom: PxFit(10),
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
	editText: {
		fontSize: PxFit(15),
		color: Theme.primaryColor
	},
	button: {
		height: PxFit(32),
		borderRadius: PxFit(16),
		marginTop: PxFit(Theme.itemSpace)
	},
	bottom: {
		marginTop: PxFit(20),
		marginBottom: PxFit(5)
	},
	introduction: {
		fontSize: PxFit(13),
		color: Theme.defaultTextColor
	},
	labels: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center'
	},
	label: {
		marginTop: PxFit(10),
		marginRight: PxFit(10),
		// paddingTop: PxFit(1),
		paddingHorizontal: PxFit(4),
		height: PxFit(24),
		minWidth: PxFit(36),
		borderWidth: PxFit(1),
		borderColor: Theme.borderColor,
		borderRadius: PxFit(15),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	labelText: {
		fontSize: PxFit(11),
		lineHeight: PxFit(12),
		color: Theme.defaultTextColor
	},
	answerTitle: {
		marginTop: PxFit(5),
		paddingTop: PxFit(4),
		borderTopWidth: PxFit(1),
		borderColor: Theme.borderColor,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	greyText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	orderText: {
		fontSize: PxFit(13),
		color: Theme.correctColor,
		marginRight: PxFit(4)
	}
});

export default UserProfile;
