/*
 * @flow
 * created by wyk made in 2019-03-21 10:05:21
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

import { TouchFeedback, Avatar, Iconfont, ItemSeparator } from '../../../components';
import { Theme, PxFit } from '../../../utils';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { Storage, ItemKeys } from '../../../store/localStorage';

import { UserQuery } from '../../../assets/graphql/user.graphql';
import { Query, ApolloClient, withApollo } from 'react-apollo';

class UserPanel extends Component {
	render() {
		let { navigation, user = {} } = this.props;
		return (
			<View style={styles.container}>
				<View style={styles.left}>
					<Avatar source={user.avatar} size={52} borderStyle={{ borderWidth: 1, borderColor: '#ffffff' }} />
					<View style={styles.content}>
						<Text style={{ color: Theme.defaultTextColor, fontSize: 15 }}>{user.name}</Text>
						<Text style={styles.user}>
							LV.{user.level ? user.level.level : '1'} {'  '}
							{user.level.name} {'  '}
							{user.exp}/{user.next_level_exp}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: PxFit(80),
		paddingHorizontal: PxFit(15),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	content: {
		height: 34,
		justifyContent: 'space-between',
		marginLeft: 15
	},
	user: {
		fontSize: 12,
		color: Theme.subTextColor,
		fontWeight: '300',
		paddingTop: 3
	}
});

export default UserPanel;
