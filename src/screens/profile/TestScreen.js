import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, Dimensions, Animated } from 'react-native';
import { DivisionLine, ErrorBoundary, ContentEnd, Button, Header } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

import { connect } from 'react-redux';

import Screen from '../Screen';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

class TestScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showHome: false,
			fadeAnim: new Animated.Value(1)
		};
	}

	render() {
		let { showHome, fadeAnim } = this.state;
		let { navigation } = this.props;
		return (
			<View // Special animatable View
				style={{
					flex: 1
				}}
			>
				<View style>
					<Text>主页</Text>
				</View>
				{!showHome && (
					<Animated.View // Special animatable View
						style={{
							flex: 1,
							position: 'absolute',
							height,
							width,
							top: 0,
							left: 0,
							opacity: fadeAnim
						}}
					>
						<Swiper autoplay={false} activeDotColor="#fff" showsPagination={true} height={74} loop={false}>
							<View>
								<Image
									source={{
										uri:
											'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546945875269&di=07fe53acb4b1a504c904d5aaa22b9fbd&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F014557578ca3eb0000012e7e02d45d.png%402o.png'
									}}
									style={styles.img}
								/>
							</View>
							<View>
								<Image
									source={{
										uri:
											'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546945875290&di=ea535118b22a64f5f5d1952cfd792ff1&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01167d5631e35232f8755701118d28.jpg'
									}}
									style={styles.img}
								/>
							</View>
							<View>
								<Image
									source={{
										uri:
											'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546945875289&di=2bd03792f328b7da6073726438704785&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01680f55f988f532f875a132ea0775.jpg%402o.jpg'
									}}
									style={styles.img}
								/>
								<TouchableOpacity
									style={{
										backgroundColor: 'transparent',
										borderWidth: 1,
										borderColor: Colors.white,
										justifyContent: 'center',
										alignItems: 'center',
										position: 'absolute',
										bottom: 60,
										left: width / 2,
										marginLeft: -55,
										height: 35,
										width: 110,
										borderRadius: 5
									}}
									onPress={() => {
										Animated.timing(
											// Animate over time
											this.state.fadeAnim, // The animated value to drive
											{
												toValue: 0, // Animate to opacity: 1 (opaque)
												duration: 1500 // Make it take a while
											}
										).start(); // Starts the animation
										this.timer = setTimeout(() => {
											this.setState({
												showHome: true
											});
										}, 1500);
										if (showHome) {
											this.timer && clearTimeout(this.timer);
										}
									}}
								>
									<Text style={{ color: Colors.white, fontSize: 16 }}>立即体验</Text>
								</TouchableOpacity>
							</View>
						</Swiper>
					</Animated.View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 74,
		alignItems: 'center',
		justifyContent: 'center'
	},
	img: {
		width,
		height: height,
		resizeMode: 'cover'
	}
});

export default TestScreen;
