/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 16:26:20
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { Colors, Divice } from '../../constants';

import { UserTitle, Avatar } from '../Universal';
import Button from '../Control/Button';
import { Iconfont } from '../utils/Fonts';

import { compose, graphql } from 'react-apollo';
import {
	FollowToggbleMutation,
	UserQuery,
	FollowsQuery,
	UserInfoQuery,
	FollowersQuery
} from '../../graphql/user.graphql';

class UserItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { user, navigation, follow } = this.props;
		return (
			<TouchableOpacity
				style={styles.container}
				activeOpacity={1}
				onPress={() => navigation.navigate('用户资料', { user_id: user.id })}
			>
				<View style={styles.left}>
					<Avatar uri={user.avatar} size={48} />
					<View style={styles.leftUserInfo}>
						<View style={styles.userInfoTop}>
							<View style={{ flexShrink: 1 }}>
								<Text style={{ color: Colors.black }} numberOfLines={1}>
									{user.name}
								</Text>
							</View>
							<UserTitle user={user} />
							<Iconfont
								style={{ paddingLeft: 5 }}
								name={user.gender ? 'woman' : 'man'}
								size={16}
								color={user.gender ? '#FF6EB4' : Colors.blue}
							/>
						</View>
						<Text style={styles.userIntro} numberOfLines={1}>
							{user.introduction ? user.introduction : '还没有介绍'}
						</Text>
					</View>
				</View>
				{follow ? (
					<Button
						name={'已关注'}
						outline
						style={[
							styles.button,
							{
								borderColor: Colors.grey
							}
						]}
						textColor={Colors.grey}
						fontSize={13}
						handler={this.followUser}
					/>
				) : (
					<Button
						name={user.followed_user_status ? '互相关注' : '关注'}
						outline
						style={[styles.button, { borderColor: user.followed_user_status ? Colors.grey : Colors.theme }]}
						textColor={user.followed_user_status ? Colors.grey : Colors.theme}
						fontSize={13}
						handler={this.followUser}
					/>
				)}
			</TouchableOpacity>
		);
	}

	followUser = async () => {
		const { user } = this.props;
		let result = {};

		try {
			result = await this.props.FollowToggble({
				variables: {
					followed_type: 'users',
					followed_id: user.id
				},
				refetchQueries: () => [
					{
						query: UserQuery,
						variables: { id: user.id }
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
						variables: { id: user.id }
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

export default compose(graphql(FollowToggbleMutation, { name: 'FollowToggble' }))(UserItem);
