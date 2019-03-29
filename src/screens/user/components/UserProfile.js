/*
 * @flow
 * created by wyk made in 2019-03-29 16:45:06
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

import { TouchFeedback, Avatar, Iconfont, ItemSeparator } from '../../../components';
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
				<View style={styles.userInfo}>
					<Avatar source={user.avatar} size={PxFit(60)} style={styles.userAvatar} />
					<View style={styles.textInfo}>
						<Text style={styles.userName} numberOfLines={1}>
							{user.name}
						</Text>
						<Text style={styles.introduction} numberOfLines={1}>
							{user.introduction || '这个人很神秘，什么介绍都有'}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	userInfoContainer: {
		height: PxFit(120),
		padding: Theme.itemSpace,
		justifyContent: 'center',
		backgroundColor: Theme.primaryColor
	},
	userCoverContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	userCover: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: null,
		height: null
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userAvatar: {
		borderWidth: PxFit(2),
		borderColor: '#fff'
	},
	textInfo: {
		flex: 1,
		paddingHorizontal: Theme.itemSpace
	},
	userName: {
		fontSize: PxFit(17),
		color: '#fff',
		fontWeight: '500'
	},
	introduction: {
		marginTop: PxFit(8),
		fontSize: PxFit(13),
		color: '#fff'
	}
});

export default UserProfile;
