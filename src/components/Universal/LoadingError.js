import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

import Colors from '../../constants/Colors';

import Spinner from 'react-native-spinkit';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.6;

class LoadingError extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}
	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}
	render() {
		let {
			size = 70,
			fontSize = 16,
			reload = () => null,
			text,
			color = Colors.theme,
			type = 'ThreeBounce',
			isVisible = true
		} = this.props;
		return (
			<View style={styles.container}>
				{this.state.loading ? (
					<View style={styles.container}>
						<Image style={styles.image} source={require('../../../assets/images/network.jpg')} />
						<Text style={{ fontSize, color: Colors.tintFont, marginVertical: 15, fontWeight: '300' }}>
							{text ? text : '哎呀，网络好像出了点问题'}
						</Text>
						<TouchableOpacity
							onPress={() => {
								reload();
								this.setState({
									loading: false
								});

								this.timer = setTimeout(() => {
									this.setState({
										loading: true
									});
								}, 3000);
							}}
						>
							<Text style={styles.reload}>重新加载</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.container}>
						<Spinner isVisible={isVisible} size={50} type={type} color={color} />
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20,
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

export default LoadingError;
