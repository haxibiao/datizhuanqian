import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '../../constants/Colors';

class RedDot extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { count } = this.props;
		return (
			<View style={styles.redDot}>
				<Text style={{ fontSize: 10, color: Colors.white }}>{count}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	redDot: {
		height: 16,
		borderRadius: 8,
		paddingHorizontal: 5,
		backgroundColor: Colors.themeRed,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default RedDot;
