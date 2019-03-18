/*
* @flow
* created by wyk made in 2019-01-06 21:58:37
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Theme, PxFit } from '../../utils';

class ListFooter extends Component {
	render() {
		let { finished, hidden } = this.props;
		if (hidden) {
			return null;
		}
		if (finished) {
			return (
				<View style={[styles.footerView, { backgroundColor: '#fff' }]}>
					<Text style={styles.footerViewText}>已经到底了</Text>
				</View>
			);
		} else {
			return (
				<View style={styles.footerView}>
					<ActivityIndicator color={Theme.primaryColor} size={'small'} />
					<Text style={styles.footerViewText}>加载中</Text>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	footerView: {
		height: PxFit(40),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	footerViewText: {
		fontSize: PxFit(14),
		color: '#a0a0a0',
		paddingHorizontal: PxFit(10)
	}
});

export default ListFooter;
