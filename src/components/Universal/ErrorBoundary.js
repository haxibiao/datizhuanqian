import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

import Colors from '../../constants/Colors';

import LoadingError from './LoadingError';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.6;

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		this.setState({ hasError: true });
		console.log('error');
	}

	render() {
		if (this.state.hasError) {
			let { size = 70, fontSize = 16, reload = () => null, text, question } = this.props;
			return (
				<View style={styles.container}>
					<Image style={styles.image} source={require('../../../assets/images/network.jpg')} />
					<Text style={{ fontSize: 16, color: Colors.tintFont, marginVertical: 15, fontWeight: '300' }}>
						{'哎呀，好像出了点问题'}
					</Text>
					<Text style={{ fontSize: 16, color: Colors.tintFont, fontWeight: '300', marginBottom: 15 }}>
						{'编号：' + question.id}
					</Text>
					<TouchableOpacity onPress={reload}>
						<Text style={styles.reload}>重新加载</Text>
					</TouchableOpacity>
				</View>
			);
		}
		return this.props.children;
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 100,
		backgroundColor: Colors.white
	},
	image: {
		width: IMAGE_WIDTH,
		height: IMAGE_WIDTH / 2,
		resizeMode: 'contain'
	},
	reload: {
		fontSize: 15,
		color: Colors.blue,
		textAlign: 'center'
	}
});

export default ErrorBoundary;
