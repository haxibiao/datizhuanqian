/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 13:34:41
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

class UserTitle extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { navigation, user } = this.props;
		return (
			<View>
				{user.is_admin ? (
					<Image
						source={require('../../assets/images/admin.png')}
						style={{ height: 13, width: 13, marginLeft: 5 }}
					/>
				) : (
					<View
						style={{
							backgroundColor: Theme.theme,
							paddingHorizontal: 2,
							marginLeft: 5,
							marginTop: 1,
							borderRadius: 1
						}}
					>
						<Text style={{ fontSize: 8, color: Theme.white }}>Lv.{user.level.level}</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default UserTitle;
