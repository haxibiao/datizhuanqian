/*
 * @flow
 * created by wyk made in 2019-02-25 13:56:04
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { Colors } from '../../constants';

class ProgressCover extends Component {
	state = {
		progress: 0
	};

	progress = progress => {
		this.setState({ progress });
	};

	hide = () => {
		this.setState({ progress: 100 });
	};

	render() {
		let { message, children } = this.props;
		let { progress } = this.state;
		return (
			<View>
				{children}
				{progress > 0 && progress < 100 && (
					<View style={styles.progress}>
						<Progress.Circle
							size={46}
							progress={progress / 100}
							color={Colors.theme}
							unfilledColor={'#fff'}
							borderColor="rgba(255,255,255,0)"
							showsText
						/>
						{message && <Text style={styles.message}>{message}</Text>}
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	progress: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(32,30,51,0.7)'
	},
	message: {
		marginTop: 6,
		fontSize: 13,
		color: '#fff',
		textAlign: 'center'
	}
});

export default ProgressCover;
