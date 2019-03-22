/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:52:05
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { TouchFeedback } from '../../../components';
import { PxFit } from '../../../utils';

class UserInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { user } = this.props;
		if (user.id == 1) {
			return null;
		}
		return (
			<TouchFeedback
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingBottom: PxFit(15)
				}}
				onPress={() => navigation.navigate('用户资料', { user_id: user.id })}
			>
				<Image
					source={{ uri: user.avatar }}
					style={{ width: PxFit(20), height: PxFit(20), borderRadius: PxFit(3) }}
				/>
				<Text style={{ fontSize: PxFit(14), color: '#222', paddingLeft: PxFit(6) }}>{user.name}</Text>
			</TouchFeedback>
		);
	}
}

const styles = StyleSheet.create({});

export default UserInfo;
