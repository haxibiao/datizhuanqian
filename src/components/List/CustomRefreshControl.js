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
	refreshing: boolean,
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

	render() {
		return <RefreshControl {...this.props} />;
	}
}

const styles = StyleSheet.create({});

export default CustomRefreshControl;
