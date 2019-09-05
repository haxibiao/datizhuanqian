/*
 * @flow
 * created by wyk made in 2018-12-06 16:01:26
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Theme, PxFit } from '../../utils';

export default function LoadingSpinner() {
	return (
		<View style={styles.indicator}>
			<ActivityIndicator size="large" color={Theme.primaryColor} />
		</View>
	);
}

const styles = StyleSheet.create({
	indicator: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: 'rgba(255,255,255,0.8)',
		justifyContent: 'center',
		alignItems: 'center'
	}
});
