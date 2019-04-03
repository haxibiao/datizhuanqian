/*
 * @flow
 * created by wyk made in 2019-01-14 17:29:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

class SubmitLoading extends Component {
	render() {
		let { style = {}, content = 'loading...', isVisible } = this.props;
		if (!isVisible) {
			return null;
		}
		return (
			<View style={[styles.uploading, style]}>
				<View style={styles.container}>
					<ActivityIndicator color="#fff" size={'small'} />
					<Text style={{ fontSize: 13, color: '#FFF', textAlign: 'center', paddingTop: 8 }}>{content}</Text>
				</View>
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
		backgroundColor: 'rgba(255,255,255,0.6)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		width: SCREEN_WIDTH / 4,
		height: SCREEN_WIDTH / 4,
		backgroundColor: 'rgba(32,30,51,0.7)',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5
	}
});

export default SubmitLoading;
