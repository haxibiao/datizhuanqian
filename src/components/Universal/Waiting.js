import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Spinner from 'react-native-spinkit';

import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

class Waiting extends Component {
	render() {
		let { size = 50, color = Colors.theme, type = 'FadingCircleAlt', isVisible } = this.props;
		if (!isVisible) {
			return null;
		}
		return (
			<View style={styles.container}>
				<Spinner size={size} type={type} color={color} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255, 0.6)'
	}
});

export default Waiting;
