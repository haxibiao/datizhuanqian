/*
 * @flow
 * created by wyk made in 2019-01-09 10:11:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Theme, PxFit, Tools } from '../../utils';

import Iconfont from '../Iconfont';
import Avatar from '../Basics/Avatar';
import SafeText from '../Basics/SafeText';
import Row from '../Container/Row';
import TouchFeedback from '../TouchableView/TouchFeedback';
import FollowButton from '../TouchableView/FollowButton';
import GenderLabel from '../Utils/GenderLabel';

type User = {
	id: number,
	avatar: any,
	name: string,
	gender: string,
	followed_user_status: number,
	introduction?: string
};

type Props = {
	user: User
};

class UserItem extends Component<Props> {
	render() {
		let { user, style, navigation } = this.props;
		let { id = 1, avatar, name, followed_user_status, introduction } = user;
		return (
			<TouchFeedback style={[styles.item, style]} onPress={() => navigation.navigate('User', { user })}>
				<Avatar source={avatar} size={PxFit(50)} />
				<View style={styles.right}>
					<View style={styles.info}>
						<Row>
							<SafeText style={styles.nameText}>{name}</SafeText>
							<GenderLabel user={user} />
						</Row>
						{introduction && (
							<View style={{ flex: 1 }}>
								<SafeText style={styles.introduction} numberOfLines={1}>
									{introduction}
								</SafeText>
							</View>
						)}
					</View>
					<FollowButton
						id={id}
						followedStatus={followed_user_status}
						style={{
							width: PxFit(70),
							height: PxFit(30),
							borderRadius: PxFit(15)
						}}
					/>
				</View>
			</TouchFeedback>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: PxFit(Theme.itemSpace)
	},
	right: {
		flex: 1,
		paddingHorizontal: PxFit(Theme.itemSpace),
		paddingVertical: PxFit(20),
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	info: {
		flex: 1,
		marginRight: PxFit(Theme.itemSpace)
	},
	nameText: {
		fontSize: PxFit(16),
		color: Theme.defaultTextColor,
		marginRight: PxFit(6)
	},
	introduction: {
		marginTop: PxFit(8),
		fontSize: PxFit(12),
		color: '#696482'
	},
	labelText: { fontSize: PxFit(12), color: '#fff', marginLeft: PxFit(2), lineHeight: PxFit(14) }
});

export default withNavigation(UserItem);
