/*
* @flow
* created by wyk made in 2018-12-12 09:14:16
*/
'use strict';

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

class Center extends Component {
	static propTypes = {
		...View.propTypes
	};

	render() {
		let { style, ...options } = this.props;
		return <View style={[styles.button, style]} {...options} />;
	}
}

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Center;
