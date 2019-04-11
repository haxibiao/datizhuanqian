/*
 * @flow
 * created by wyk made in 2019-04-11 10:20:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Theme, PxFit, Tools } from '../../utils';
import Spinner from 'react-native-spinkit';

import Iconfont from '../Iconfont';
import TouchFeedback from '../TouchableView/TouchFeedback';

type Props = {
	style?: Object,
	hidden: boolean,
	finished: boolean,
	onLoad: Function
};
class Loader extends Component<Props> {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		};
	}

	loadMore = async () => {
		this.setState({ loading: true });
		await this.props.onLoad();
		this.setState({ loading: false });
	};

	render() {
		let { hidden, style, finished } = this.props;
		let { loading } = this.state;
		if (hidden) {
			return null;
		}
		if (finished) {
			return (
				<View style={[styles.loadView, style]}>
					<Text style={styles.loadViewText}>没有更多了哦~</Text>
				</View>
			);
		} else if (loading) {
			return (
				<View style={[styles.loadView, style]}>
					<Text style={styles.loadViewText}>加载中</Text>
					<Spinner isVisible={true} size={PxFit(14)} type={'FadingCircleAlt'} color={Theme.primaryColor} />
				</View>
			);
		} else {
			return (
				<TouchFeedback style={[styles.loadView, style]} onPress={Tools.throttle(this.loadMore, 400)}>
					<Text style={styles.loadText}>加载更多</Text>
					<Iconfont name="down" size={PxFit(15)} color={Theme.primaryColor} />
				</TouchFeedback>
			);
		}
	}
}

const styles = StyleSheet.create({
	loadView: {
		paddingVertical: PxFit(Theme.itemSpace),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadViewText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		marginHorizontal: PxFit(10)
	},
	loadText: {
		fontSize: PxFit(13),
		color: Theme.primaryColor,
		marginRight: PxFit(4)
	}
});

export default Loader;
