/*
 * @flow
 * created by wyk made in 2018-12-12 09:12:50
 */
'use strict';

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

class Row extends Component {
	static propTypes = {
		...View.propTypes
	};

	render() {
		let { style, ...options } = this.props;
		return <View style={[styles.row, style]} {...options} />;
	}
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export default Row;
