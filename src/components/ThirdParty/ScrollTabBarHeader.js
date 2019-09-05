/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 11:58:44
 */

'use strict';

import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';

import { StyleSheet, View, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Theme, SCREEN_WIDTH } from '../../utils';

import Iconfont from '../Iconfont';
import ScrollTabBar from './ScrollTabBar';

class TabBarHeader extends Component {
	render() {
		let { navigation, width = containerWidth, tabUnderlineWidth } = this.props;
		return (
			<View style={styles.header}>
				<TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
					<Iconfont name={'left'} size={19} color={Theme.primaryFont} />
				</TouchableOpacity>
				<ScrollTabBar
					tabUnderlineWidth={50}
					{...this.props}
					containerWidth={width}
					style={{
						width: SCREEN_WIDTH - 100
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		paddingTop: Platform.OS == 'ios' ? 35 : StatusBar.currentHeight,
		height: StatusBar.currentHeight + 40,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Theme.white
	},
	goBack: {
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		width: 40,
		height: 40,
		bottom: 0,
		left: 15
	}
});

export default withNavigation(TabBarHeader);
