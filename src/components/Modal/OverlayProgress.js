/*
 * @flow
 * created by wyk made in 2019-02-25 13:56:04
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { Colors, Divice } from '../../constants';

class OverlayProgress extends Component {
	render() {
		let { visible, progress, message } = this.props;
		if (!visible) {
			return null;
		}
		return (
			<View style={styles.container}>
				<View style={styles.progress}>
					<Progress.Circle
						size={80}
						progress={progress / 100}
						color={Colors.theme}
						unfilledColor={'#fff'}
						borderColor="rgba(255,255,255,0)"
						showsText
					/>
					{message && <Text style={styles.message}>{message}</Text>}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: Divice.width,
		height: Divice.height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255, 0.6)'
	},
	progress: {
		width: Divice.width / 3,
		height: Divice.width / 3,
		minWidth: 120,
		minHeight: 120,
		borderRadius: 6,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.7)'
	},
	message: {
		marginTop: 6,
		fontSize: 15,
		color: '#fff',
		textAlign: 'center'
	}
});

export default OverlayProgress;
