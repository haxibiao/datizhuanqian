/*
 * @flow
 * created by wyk made in 2019-08-30 11:15:31
 */
import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { Theme, PxFit, ISIOS, ISAndroid } from '../../../utils';
import { withNavigation } from 'react-navigation';
import * as Progress from 'react-native-progress';
import { BoxShadow } from 'react-native-shadow';

const shadowOpt = {
	width: PxFit(60),
	height: PxFit(60),
	color: '#FFF4E9',
	border: 3,
	radius: 30,
	opacity: 0.5,
	x: 0,
	y: 1,
	style: {
		marginTop: 0
	}
};

class WithdrawProgress extends Component {
	render() {
		const { progress, navigation } = this.props;
		return (
			<BoxShadow setting={shadowOpt}>
				<TouchableOpacity style={styles.circleProgress} onPress={() => navigation.navigate('Withdraws')}>
					<Progress.Circle
						progress={progress / 100}
						size={PxFit(60)}
						borderWidth={0}
						color="#ff5644"
						fill="#fff"
						thickness={PxFit(4)}
						endAngle={1}
						strokeCap={'round'}
					/>
					<Image source={require('../../../assets/images/red_envelope.png')} style={styles.redEnvelope} />
				</TouchableOpacity>
			</BoxShadow>
		);
	}
}

const styles = StyleSheet.create({
	circleProgress: {
		position: 'relative',
		width: PxFit(60),
		height: PxFit(60),
		borderRadius: PxFit(30),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	redEnvelope: {
		position: 'absolute',
		top: 0,
		left: 0,
		marginLeft: PxFit(8),
		marginTop: PxFit(8),
		width: PxFit(44),
		height: PxFit(44)
	}
});

export default withNavigation(WithdrawProgress);
