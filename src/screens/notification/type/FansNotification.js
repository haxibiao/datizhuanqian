/*
 * @Author: Gaoxuan
 * @Date:   2019-03-12 09:54:46
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { Colors, Divice } from '../../../constants';

import { Button, Avatar, UserTitle, Iconfont } from '../../../components';

import { compose, graphql } from 'react-apollo';
import {
	FollowToggbleMutation,
	UserQuery,
	FollowsQuery,
	UserInfoQuery,
	FollowersQuery
} from '../../../graphql/user.graphql';

class FansNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { follow, navigation } = this.props;

		if (!follow) return null;

		let created_at = follow.created_at.substr(5, 5);
		console.log('created_at', created_at);
		return (
			<TouchableOpacity
				style={styles.container}
				activeOpacity={1}
				onPress={() => navigation.navigate('用户资料', { user_id: follow.user.id })}
			>
				<View style={styles.left}>
					<Avatar uri={follow.user.avatar} size={48} />
					<View style={styles.leftUserInfo}>
						<View style={styles.userInfoTop}>
							<View style={{ flexShrink: 1 }}>
								<Text style={{ color: Colors.black }} numberOfLines={1}>
									{follow.user.name}
								</Text>
							</View>
							<UserTitle user={follow.user} />
							<Iconfont
								style={{ paddingLeft: 5 }}
								name={follow.user.gender ? 'woman' : 'man'}
								size={16}
								color={follow.user.gender ? '#FF6EB4' : Colors.blue}
							/>
						</View>
						<Text style={styles.userIntro}>{'关注了你  ' + created_at}</Text>
					</View>
				</View>

				<Button
					name={follow.user.followed_user_status ? '互相关注' : '关注'}
					outline
					style={[
						styles.button,
						{
							borderColor: follow.user.followed_user_status ? Colors.grey : Colors.theme
						}
					]}
					textColor={follow.user.followed_user_status ? Colors.grey : Colors.theme}
					fontSize={13}
					handler={this.followUser}
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
						query: UserQuery,
						variables: { id: follow.user.id }
					},
					{
						query: FollowsQuery,
						variables: { filter: 'users' }
					},
					{
						query: FollowersQuery,
						variables: { filter: 'users' }
					},
					{
						query: UserInfoQuery,
						variables: { id: follow.user.id }
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}

		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, 80); //Toast错误信息
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
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.lightBorder
	},
	left: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	leftUserInfo: {
		flex: 1,
		marginHorizontal: 15
	},
	userInfoTop: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userIntro: {
		lineHeight: 22,
		color: Colors.grey,
		fontSize: 13
	},
	button: {
		borderRadius: 3,
		height: 30,
		width: 72,
		borderWidth: 0.5
	}
});

export default compose(graphql(FollowToggbleMutation, { name: 'FollowToggble' }))(FansNotification);
