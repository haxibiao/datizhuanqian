/*
 * @flow
 * created by wyk made in 2019-03-21 10:05:21
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

import { TouchFeedback, Avatar, Iconfont, ItemSeparator } from 'components';
import { Theme, PxFit } from 'utils';

// import { Storage, ItemKeys } from '../../../store/localStorage';

import { Query, ApolloClient, withApollo, GQL } from 'apollo';

class UserPanel extends Component {
	render() {
		let { navigation, user = {} } = this.props;
		return (
			<View style={styles.userPanel}>
				<View style={styles.panelLeft}>
					<Avatar source={user.avatar} size={52} borderStyle={{ borderWidth: 1, borderColor: '#ffffff' }} />
					<View style={styles.panelContent}>
						<Text style={{ color: Theme.defaultTextColor, fontSize: 15 }}>{user.name}</Text>
						<Text style={styles.userLevel}>
							LV.{user.level ? user.level.level : '1'} {'  '}
							{user.level.name} {'  '}
							{user.level ? user.level.exp : 0}/{user.next_level_exp}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	userPanel: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: PxFit(80),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor,
		marginHorizontal: PxFit(Theme.itemSpace)
	},
	panelLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	panelContent: {
		height: PxFit(34),
		justifyContent: 'space-between',
		marginLeft: PxFit(15)
	},
	userLevel: {
		fontSize: PxFit(12),
		color: Theme.subTextColor,
		fontWeight: '300',
		paddingTop: PxFit(3)
	}
});

export default UserPanel;
