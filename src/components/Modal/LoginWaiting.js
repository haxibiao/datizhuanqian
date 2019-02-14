import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

class LoginWaiting extends Component {
	render() {
		let { isVisible, customStyle = {} } = this.props;
		if (!isVisible) {
			return null;
		}
		return (
			<View style={styles.container}>
				<ActivityIndicator size="small" color={Colors.theme} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: width / 3,
		height: width / 3,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255, 0.6)'
	}
});

export default LoginWaiting;
