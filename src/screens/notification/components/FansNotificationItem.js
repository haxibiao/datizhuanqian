/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 14:27:39
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { Theme, PxFit, Tools } from 'utils';

import { Button, Avatar, UserTitle, Iconfont, GenderLabel, FollowButton } from 'components';

import { Query, withApollo, GQL, compose, graphql } from 'apollo';
import { app } from 'store';

class FansNotificationItem extends Component {
	constructor(props) {
		super(props);
		const { follow } = this.props;
	}
	render() {
		const { follow, navigation } = this.props;

		if (!follow) return null;
		let user = Tools.syncGetter('user', follow);
		let created_at = follow.created_at.substr(5, 5);

		return (
			<TouchableOpacity
				style={styles.container}
				activeOpacity={1}
				onPress={() => navigation.navigate('User', { user })}
			>
				<View style={styles.left}>
					<Avatar source={{ uri: Tools.syncGetter('avatar', user) }} size={48} />
					<View style={styles.leftUserInfo}>
						<View style={styles.userInfoTop}>
							<View style={{ flexShrink: 1 }}>
								<Text style={{ color: Theme.black }} numberOfLines={1}>
									{Tools.syncGetter('name', user)}
								</Text>
							</View>
							<UserTitle user={user} />
							<GenderLabel user={user} />
						</View>
						<Text style={styles.userIntro}>{'关注了你  ' + created_at}</Text>
					</View>
				</View>

				<FollowButton
					id={Tools.syncGetter('id', user)}
					followedStatus={Tools.syncGetter('followed_user_status', user)}
					style={{
						width: PxFit(70),
						height: PxFit(30),
						borderRadius: PxFit(15)
					}}
				/>
			</TouchableOpacity>
		);
	}

	followUser = async () => {
		const { follow } = this.props;
		let result = {};

		try {
			result = await this.props.FollowToggble({
				variables: {
					followed_type: 'users',
					followed_id: follow.user.id
				},
				refetchQueries: () => [
					{
						query: GQL.UserQuery,
						variables: { id: follow.user.id }
					},
					{
						query: GQL.FollowsQuery,
						variables: { filter: 'users' }
					},
					{
						query: GQL.FollowersQuery,
						variables: { filter: 'users' }
					},
					{
						query: GQL.UserInfoQuery,
						variables: { id: follow.user.id }
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}

		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str }); //Toast错误信息
		} else {
			// Methods.toast('关注成功', 80);
		}
	};
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: PxFit(15),
		paddingVertical: PxFit(15),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder
	},
	left: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	leftUserInfo: {
		flex: 1,
		marginHorizontal: PxFit(15)
	},
	userInfoTop: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userIntro: {
		lineHeight: PxFit(22),
		color: Theme.grey,
		fontSize: PxFit(13)
	},
	button: {
		borderRadius: PxFit(3),
		height: PxFit(30),
		width: PxFit(72),
		borderWidth: PxFit(0.5)
	}
});

export default compose(graphql(GQL.FollowToggbleMutation, { name: 'FollowToggble' }))(FansNotificationItem);
