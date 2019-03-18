/*
* @flow
* created by wyk made in 2019-01-14 17:29:13
*/
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Theme, PxFit } from '../../utils';

class Uploading extends Component {
	render() {
		let { style = {} } = this.props;
		return (
			<View style={[styles.uploading, style]}>
				<ActivityIndicator color="#fff" size={'small'} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	uploading: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(00,00,00,0.3)',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Uploading;
