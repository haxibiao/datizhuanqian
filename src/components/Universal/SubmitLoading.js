import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator, Text } from 'react-native';
import { Colors, Divice } from '../../constants';

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
					width: Divice.width,
					height: Divice.height,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'rgba(255,255,255, 0.6)'
				}}
			>
				<View style={styles.container}>
					<ActivityIndicator size="small" color={Colors.white} />
					<Text style={{ fontSize: 13, color: Colors.white, textAlign: 'center', paddingTop: 8 }}>
						{tips ? tips : '登录中...'}
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: Divice.width / 4,
		height: Divice.width / 4,
		backgroundColor: 'rgba(48,48,48,0.6)',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5
	}
});

export default LoginWaiting;
