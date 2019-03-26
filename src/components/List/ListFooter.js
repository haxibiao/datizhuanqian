/*
 * @flow
 * created by wyk made in 2019-01-06 21:58:37
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Theme, PxFit } from '../../utils';
import Spinner from 'react-native-spinkit';

type Props = {
	hidden: boolean,
	finished: boolean,
	text: string
};
class ListFooter extends Component<Props> {
	render() {
		let { hidden, finished, text } = this.props;
		if (hidden) {
			return null;
		}
		if (finished) {
			return (
				<View style={styles.footerView}>
					<Text style={styles.footerViewText}>{text || '-- 没有更多了哦 --'}</Text>
				</View>
			);
		} else {
			return (
				<View style={styles.footerView}>
					<Spinner isVisible={true} size={PxFit(16)} type={'FadingCircleAlt'} color={Theme.primaryColor} />
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
		marginHorizontal: PxFit(10)
	}
});

export default ListFooter;
