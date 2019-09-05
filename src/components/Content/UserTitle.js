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
						style={{ height: PxFit(13), width: PxFit(13), marginHorizontal: PxFit(5) }}
					/>
				) : (
					<View
						style={{
							backgroundColor: Theme.theme,
							paddingVertical: PxFit(1),
							paddingHorizontal: PxFit(2),
							marginHorizontal: PxFit(5),
							borderRadius: PxFit(2)
						}}
					>
						<Text style={{ fontSize: PxFit(8), color: '#fff', lineHeight: PxFit(10) }}>
							Lv.{user.level.level}
						</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default UserTitle;
