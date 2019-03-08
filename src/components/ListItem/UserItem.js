/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 16:26:20
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Colors, Divice } from '../../constants';

import { UserTitle, Avatar } from '../Universal';
import Button from '../Control/Button';
import { Iconfont } from '../utils/Fonts';

class UserItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { user, navigation, follow } = this.props;
		return (
			<View style={styles.container}>
				<View style={styles.left}>
					<Avatar uri={user.avatar} size={48} />
					<View style={styles.leftUserInfo}>
						<View style={styles.userInfoTop}>
							<Text style={{ color: Colors.black }}>{user.name}</Text>
							<UserTitle user={user} />
							<Iconfont
								style={{ paddingLeft: 5 }}
								name={user.gender ? 'woman' : 'man'}
								size={16}
								color={user.gender ? '#FF6EB4' : Colors.blue}
							/>
						</View>
						<Text style={styles.userIntro}>{user.description ? user.description : '没有介绍'}</Text>
					</View>
				</View>
				{follow ? (
					<Button
						name={user.is_follow ? '已关注' : '互相关注'}
						outline
						style={[
							styles.button,
							{
								borderColor: Colors.grey
							}
						]}
						textColor={Colors.grey}
						fontSize={13}
						// handler={this.receiveTask}
					/>
				) : (
					<Button
						name={user.is_follow ? '互相关注' : '关注'}
						outline
						style={[styles.button, { borderColor: user.is_follow ? Colors.grey : Colors.theme }]}
						textColor={user.is_follow ? Colors.grey : Colors.theme}
						fontSize={13}
						// handler={this.receiveTask}
					/>
				)}
			</View>
		);
	}
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
		flexDirection: 'row',
		alignItems: 'center'
	},
	leftUserInfo: {
		marginLeft: 15
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

export default UserItem;
