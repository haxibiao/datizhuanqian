import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator, Text } from 'react-native';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

class LoginWaiting extends Component {
	render() {
		let { isVisible, customStyle = {}, tips } = this.props;
		if (!isVisible) {
			return null;
		}
		return (
			<View
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width,
					height,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'rgba(255,255,255, 0.6)'
				}}
			>
				<View style={styles.container}>
					<ActivityIndicator size="small" color={Colors.theme} />
					<Text style={{ fontSize: 13, color: Colors.gery, textAlign: 'center', paddingTop: 8 }}>
						{tips ? tips : '登录中...'}
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: width / 3,
		height: width / 3
	}
});

export default LoginWaiting;
