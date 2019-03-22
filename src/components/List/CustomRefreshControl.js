/*
 * @flow
 * created by wyk made in 2018-12-11 16:16:04
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';

import { Theme } from '../../utils';

type Props = {
	onRefresh: Function,
	title?: string,
	size?: ?string,
	tintColor?: ?string,
	colors?: Array<string>,
	progressBackgroundColor?: ?string
};

class CustomRefreshControl extends Component<Props> {
	static defaultProps = {
		title: '',
		size: undefined,
		tintColor: '#FFCC80',
		colors: [Theme.primaryColor, '#FFCC80'],
		progressBackgroundColor: '#fff'
	};

	constructor(props) {
		super(props);

		this.state = {
			isRefreshing: false
		};
	}

	onRefresh = () => {
		if (!this.props.onRefresh) return;
		this.setState({ isRefreshing: true }, async () => {
			await this.props.onRefresh();
			this.setState({ isRefreshing: false });
		});
	};

	render() {
		let { refreshing, onRefresh, ...props } = this.props;
		return <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh} {...props} />;
	}
}

const styles = StyleSheet.create({});

export default CustomRefreshControl;
