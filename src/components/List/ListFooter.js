/*
 * @flow
 * created by wyk made in 2019-01-06 21:58:37
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Theme, PxFit } from '../../utils';
// import Spinner from 'react-native-spinkit';

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
					<Text style={styles.footerViewText}>{text || '没有更多了哦'}</Text>
				</View>
			);
		} else {
			return (
				<View style={styles.footerView}>
					<Text style={styles.footerViewText}>加载中</Text>
					{/*<Spinner isVisible={true} size={PxFit(14)} type={'FadingCircleAlt'} color={Theme.primaryColor} />*/}
					<ActivityIndicator size="small" color={Theme.primaryColor} />
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	footerView: {
		paddingVertical: PxFit(Theme.itemSpace),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	footerViewText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		marginHorizontal: PxFit(10)
	}
});

export default ListFooter;
