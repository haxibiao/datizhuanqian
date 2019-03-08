/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 16:53:54
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Screen, Avatar, Button, Iconfont, DivisionLine } from '../../../components';
import { Colors, Divice } from '../../../constants';
import { Methods } from '../../../helpers';

import { compose, graphql } from 'react-apollo';
import { FollowToggbleMutation, UserInfoQuery } from '../../../graphql/user.graphql';

class HeaderUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			is_follow: false
		};
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
			Methods.toast('关注成功', 80);
		}
	};

	render() {
		const { user } = this.props;
		return (
			<View>
				<View style={styles.header}>
					<View style={styles.headerUser}>
						<View style={styles.row}>
							<Avatar
								uri={user.avatar}
								size={64}
								borderStyle={{
									borderWidth: 2,
									borderColor: Colors.white
								}}
							/>
							<View style={{ marginLeft: 15 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={styles.nameText} numberOfLines={1}>
										{user.name}
									</Text>
									<Iconfont
										name={user.gender ? 'woman' : 'man'}
										style={{ marginBottom: 3 }}
										size={16}
										color={user.gender ? '#FF6EB4' : Colors.blue}
									/>
								</View>
								<Text style={styles.levelText}>等级 Lv.{user.level.level} | 粉丝 233</Text>
							</View>
						</View>
						<Button
							name={this.state.is_follow ? '已关注' : '关 注'}
							outline
							style={styles.button}
							textColor={Colors.white}
							fontSize={15}
							handler={this.followUser}
						/>
					</View>
					<Text style={{ paddingVertical: 20, paddingLeft: 20 }}>知识就是财富，知识就是金钱</Text>
				</View>
				<DivisionLine height={10} />

				<View style={styles.footer}>
					<Text style={styles.footerTitle}>他的出题</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: Colors.theme,
		paddingHorizontal: 35
	},
	button: {
		borderRadius: 3,
		height: 30,
		width: 68,
		borderWidth: 0.5,
		borderColor: Colors.white,
		backgroundColor: 'rgba(255, 255, 255, 0.1)'
	},
	headerUser: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 5
	},
	row: {
		width: (Divice.width * 4) / 11 - 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	levelText: {
		color: Colors.white,
		// fontWeight: '500',
		fontSize: 12
	},
	nameText: {
		fontSize: 15,
		fontWeight: '200',
		paddingBottom: 5,
		paddingRight: 3,
		color: Colors.orange
	},
	count: {
		color: Colors.grey,
		fontWeight: '200',
		paddingBottom: 10
	},
	footer: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		paddingHorizontal: 15,
		paddingVertical: 12
	},
	footerTitle: {
		color: Colors.primaryFont,
		fontSize: 16,
		fontWeight: '500'
	}
});

export default compose(graphql(FollowToggbleMutation, { name: 'FollowToggble' }))(HeaderUser);
