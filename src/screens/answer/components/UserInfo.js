/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:52:05
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { TouchFeedback, Avatar } from '../../../components';
import { PxFit, Theme } from '../../../utils';

class UserInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { user, navigation } = this.props;
		if (user.id == 1) {
			return null;
		}
		return (
			<TouchFeedback style={styles.userItem} onPress={() => navigation.navigate('User', { user })}>
				<Avatar source={user.avatar} size={PxFit(24)} />
				<Text style={styles.userName}>{user.name}</Text>
			</TouchFeedback>
		);
	}
}

const styles = StyleSheet.create({
	userItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: PxFit(Theme.itemSpace)
	},
	userName: { fontSize: PxFit(13), color: Theme.defaultTextColor, paddingLeft: PxFit(6) }
});

export default UserInfo;
