/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:25:15
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Theme } from '../../utils';

class RedDot extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { count } = this.props;
		return (
			<View style={styles.redDot}>
				<Text style={{ fontSize: 10, color: Theme.white }}>{count}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	redDot: {
		height: 16,
		borderRadius: 8,
		paddingHorizontal: 5,
		backgroundColor: Theme.themeRed,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default RedDot;
